import { useEffect, useState, useContext, useMemo } from 'react';
import { atom, useAtom } from 'jotai';
import { v4 } from 'uuid';
import {
    EVENT_ERROR,
    EVENT_CREATE_STATE,
    EVENT_DELIM,
    EVENT_SET_STATE,
    EVENT_USE_STATE,
    DEFAULT_SCOPE,
    EVENT_EXECUTE_ACTION,
    EVENT_USE_COMPONENT,
} from './consts';
import { context } from './context';
import { orgLogger } from './lib/logger';
import {
    on,
    onMessage,
    emit,
    consume,
    off,
    parseSocketResponse,
    request,
} from './lib/util/socket';

let stateCount = 0;

const isRenderResponse = (eventData) => true;
const increaseCount = () => stateCount++;
const join =
    (delim) =>
    (...strings) =>
        strings.join(delim);
const genEventName = join(EVENT_DELIM);
const genIdEventName = (event) => (id) => genEventName(event, id);
const genSetStateEventName = genIdEventName(EVENT_SET_STATE);
const genCreateStateEventName = genIdEventName(EVENT_CREATE_STATE);
const genErrorEventName = genIdEventName(EVENT_ERROR);
const genComponentEvent = genIdEventName(EVENT_USE_COMPONENT);
const genActionEvent = genIdEventName(EVENT_EXECUTE_ACTION);

/**
 * @typedef {'$client' | "String"} StateScope - The scope of the state qwe
 */

/**
 * @typedef {Object} UseServerStateOptions
 * @property {String} key - The key of the state on the server e.g. 'foo'
 * @property {StateScope} scope - The scope of the state on the server e.g. bar
 * @property {Boolean} strict - Strict mode.
 * @property {Serializable} defaultValue - Initial value the server stores and sends back.
 */

/**
 * useServerState - Hook to request a state on a public/private state-server.
 * @param {*} clientDefaultValue - Initial value the client stores. e.g. "Loading..."
 * @param {UseServerStateOptions} options - Options
 */

const alignArgs =
    (length, ...def) =>
    (...args) => {
        const nargs = [...args];
        for (let i = length; i > def.length; i--) {
            if (!args[i - 1]) {
                nargs[i - 1] = args[i - 2];
                nargs[i - 2] = def[i - 2];
            }
        }
        return nargs;
    };

const alignUseServerStateArgs = alignArgs(2, null);

const atoms = new Map();

const useStore = (store, key) => {
    const [atom, setAtom] = useState(null);
};

export const useStream = (name, def) => {
    const { socket, open } = useContext(context);
    const id = useMemo(() => v4(), []);
    const [data, setData] = useState(def || null);

    useEffect(() => {
        if (open) {
            emit(socket, { action: 'stream', name, id });
            on(socket, 'message', async (event) => {
                const data = await consume(event);
                if (data === 'ping') return;
                const json = parseSocketResponse(data);
                if (data.id === id) {
                    setData(json);
                }
            });
        }
    }, [open]);

    return data;
};

const stateLoadingStates = {};

type InternalState = {
    id: string;
    value: any;
    error: Error;
    loading: number;
    clientId: string;
    component: Record<string, any>;
};
export const useServerState = (clientDefaultValue, options) => {
    var [clientDefaultValue, options] = alignUseServerStateArgs(
        clientDefaultValue,
        options
    );
    const {
        key,
        strict = false,
        defaultValue,
        defer = false,
        value = defaultValue,
        scope = DEFAULT_SCOPE,
        suspend = false,
        rendered = null,
        requestType = 'request',
        ...rest
    } = options;
    const ctx = useContext(context);
    try {
        const { socket, open } = ctx;

        const defaultState = useMemo(
            () => ({
                value: clientDefaultValue,
                id: rest.id || null,
                scope,
                key,
            }),
            []
        );
        let atm;

        if (!atoms.has(`${scope}:${key}:${rest.id}`)) {
            atm = atom({
                defaultState,
                clientId: increaseCount(),
                loading: false,
            });

            // Because multiple hooks may access the same component we need to bypass the react render cycle
            stateLoadingStates[`${scope}:${key}`] = false;
            atoms.set(`${scope}:${key}:${rest.id}`, atm);
        } else {
            atm = atoms.get(`${scope}:${key}:${rest.id}`);
        }

        const [state, setState]: [InternalState, (v) => void] = useAtom(atm);
        const { id, error, clientId } = state;

        useEffect(() => {
            if (rest.id) {
                setState({ ...state, id: rest.id });
            }
        }, [rest.id]);

        const extendState = (data) => setState({ ...state, ...data });

        const setLoading = (loading) => {
            stateLoadingStates[`${scope}:${key}`] = loading;
            extendState({ loading });
        };

        const setStateEvent = useMemo(() => genSetStateEventName(id), [id]);
        const createStateEvent = useMemo(
            () => genCreateStateEventName(clientId),
            [clientId]
        );
        const errorEvent = useMemo(
            () => genErrorEventName(clientId),
            [clientId]
        );

        const onTimeout = () => {
            setState((state) => {
                const { id } = state;
                if (!id) {
                    return {
                        ...state,
                        error: new Error('Cancelling state due to timeout'),
                    };
                }
                return state;
            });

            setLoading(false);
        };

        useEffect(() => {
            let to;
            const onPageShow = () => {
                orgLogger.info`Subscribing to state ${key}`;
                emit(socket, {
                    action: EVENT_USE_STATE,
                    key,
                    defaultValue: value,
                    scope,
                    requestId: clientId,
                    options: { ...rest },
                    requestType,
                });
            };

            if (
                open &&
                !id &&
                !error &&
                !defer &&
                !stateLoadingStates[`${scope}:${key}`]
            ) {
                stateLoadingStates[`${scope}:${key}`] = true;

                var onSetValue = async (event) => {
                    const eventData = await consume(event);
                    if (eventData === 'ping') return;

                    const data = parseSocketResponse(eventData);
                    if (
                        eventData.action === 'setValue' &&
                        (clientId === eventData.requestId || id === data.id) &&
                        typeof data.value === 'undefined'
                    ) {
                        return state;
                    }
                    if (
                        eventData.action === 'setValue' &&
                        (clientId === eventData.requestId || id === data.id)
                    ) {
                        setState((state) => {
                            return { ...state, ...data };
                        });
                    }
                };
                onMessage(socket, onSetValue);

                onPageShow();
                window.addEventListener('pageshow', onPageShow);
            }

            return () => {
                off(socket, 'message', onSetValue);
                window.removeEventListener('pageshow', onPageShow);
                stateLoadingStates[`${scope}:${key}`] = false;

                // stateLoadingStates[`${scope}:${key}`]
                // [createStateEvent].forEach(event => socket.removeAllListeners(event));
            };
        }, [open, defer, scope, key]);

        /*
         *   This hook attaches listeners for the setValue event for existent states
         *   Existent means we already obtained the states id
         *   The value of the hooks atom will be updated if the id of the state matches the id of they
         */
        useEffect(() => {
            if (id) {
                if (!defer && id) {
                    var onSetValue = async () => {
                        const eventData = await consume(event);
                        if (eventData === 'ping') return;

                        const data = parseSocketResponse(eventData);
                        if (
                            eventData.action === 'setValue' &&
                            (clientId === eventData.requestId ||
                                id === data.id) &&
                            typeof data.value === 'undefined'
                        ) {
                            return state;
                        }

                        if (
                            eventData.action === 'setValue' &&
                            (clientId === eventData.requestId || id === data.id)
                        ) {
                            setState((state) => {
                                delete state.error;
                                return { ...state, ...data };
                            });
                        }
                    };
                    on(socket, 'message', onSetValue);

                    var onError = async (event) => {
                        const data = await consume(event);
                        if (data === 'ping') return;

                        /**
                         * Only handles error messages that have the same id as the state.
                         * There's currently no serverside mechanism that raises a state specific error.
                         * This needs to be updated on the serverside to reflect the changes
                         */
                        if (data.type === 'error' && id === data.id) {
                            const err = await parseSocketResponse(data);
                            extendState({ error: new Error(err.message) });
                        }
                    };

                    on(socket, 'message', onError);
                }
            }
            return () => {
                if (id) {
                    off(socket, 'message', onSetValue);
                    off(socket, 'message', onError);
                }
            };
        });

        useEffect(() => {
            if (strict && error) {
                throw error;
            }
        }, [error]);

        useEffect(() => {
            // if (id || error) {
            // setLoading(false);
            // }
        }, [id, error, key]);

        const setServerState = (value) => {
            emit(socket, {
                action: EVENT_SET_STATE,
                id,
                key,
                value,
                scope,
            });
        };

        if (state.error) {
            if (strict) {
                throw state.error;
            }
            return [state.error, state.value];
        }

        if (
            suspend &&
            !state.value &&
            stateLoadingStates[`${scope}:${key}`] &&
            !id
        ) {
            // return [state.value, createStateEvent];
            throw new Promise(() => {});
        }

        if (!key && options.defer) {
            return [clientDefaultValue || null];
        }

        // baseLogger.debug`Returning live state ${state} ${key} with value ${state.value} ${clientDefaultValue}`
        return [
            typeof state.value === 'undefined'
                ? clientDefaultValue
                : state.value,
            setServerState,
        ];
    } catch (e) {
        if (!ctx)
            throw new Error(
                'No available context. Are you missing a Provider?'
            );
        throw e;
    }
};

export const useResponse = (fn, action, keepAlive) => {
    const ctx = useContext(context);

    const { socket } = ctx;

    const [id, setId] = useState(null);

    useEffect(() => {
        if (!id) return;
        onMessage(socket, async (event) => {
            const eventData = await consume(event);
            if (eventData === 'ping') return;

            const data = parseSocketResponse(eventData);
            if (eventData.id === id) {
                fn(data);
            }
        });
    }, [id]);

    return (...args) => {
        const id = action(...args);
        setId(id);
    };
};
const componentAtoms = new Map();
const loadingStates = {};

/**
 * @param {boolean} strict - Throws errors in strict mode
 * @param {boolean} suspend - Throws a promise while loading
 * @param {string} scope - The scope of the components store
 * @param {props} scope - The clientside props passed to the backend component.
 */
type UseComponentOptions = {
    strict?: boolean;
    suspend?: boolean;
    scope: string;
    props: Record<string, any>;
};

/**
 * useComponent - Hook that renders serverside components
 * @param {*} componentKey - The key of the serverside component
 * @param {*} options - Options

 */
export const useComponent = (
    componentKey: string,
    {
        strict = false,
        suspend = false,
        scope = DEFAULT_SCOPE,
        props: clientProps,
        ...rest
    }: UseComponentOptions,
    rendered: Record<string, any>
) => {
    const ctx = useContext(context);

    try {
        const { socket, sockets, open, secOpen, allOpen, headers } = ctx;

        const defaultState = useMemo(
            () => ({
                component: rendered,
                props: {},
                scope,
                key: componentKey,
                loading: false,
            }),
            []
        );

        let atm;

        if (!componentAtoms.has(`${scope}:${componentKey}`)) {
            atm = atom({ defaultState });
            loadingStates[`${scope}:${componentKey}`] = false;
            componentAtoms.set(`${scope}:${componentKey}`, atm);
        } else {
            atm = componentAtoms.get(`${scope}:${componentKey}`);
        }
        const [internalState, setState]: [InternalState, (v: any) => void] =
            useAtom(atm);

        const extendState = (data) => setState({ ...internalState, ...data });
        const setLoading = (loading) => extendState({ loading });

        const { component } = internalState;
        const [componentState] = useServerState(component, {
            key: componentKey,
            scope: 'public',
            defer: !component && !rendered,
            requestType: 'subscribe',
            rendered,
        });
        // useTraceUpdate(internalState);

        const resolved = {};
        const keys = Object.keys((componentState || rendered)?.props || {});

        if (keys.length > 15) {
            orgLogger.warning`Component has over 15 states. Components are currently limited to ${15} states`;
        }

        keys.length = 15;

        /**
         * We cannot use array iterators because it skips over empty entries.
         */
        // eslint-disable-next-line no-restricted-syntax
        for (const propKey of keys) {
            const serverProps = (componentState || rendered)?.props || {};
            const state = serverProps[propKey] || {};

            const resolvedState = useServerState(state.value, {
                key: state.key,
                scope: state.scope,
                id: state.id,
                defer: !state.id || !state.key || !state.scope,
            });
            if (state.id && state.key && state.scope) {
                if (typeof resolvedState[0] !== 'undefined') {
                    const [value, setValue] = resolvedState;
                    const setKey = `set${propKey[0].toUpperCase()}${propKey.slice(
                        1
                    )}`;
                    resolved[propKey] = value;
                    resolved[setKey] = setValue;
                }
            }
        }
        /** Bind action functions */
        (componentState || rendered)?.props?.children
            ?.filter((child) => {
                return child.component === 'Action';
            })
            .forEach((action) => {
                action.props.fns = action.props.handler.reduce(
                    (fns, handler) => {
                        return Object.assign(fns, {
                            [handler]: async (...args) => {
                                const id = v4();
                                try {
                                    const res = await request(
                                        [socket, ...sockets],
                                        {
                                            action: 'call',
                                            props: clientProps,
                                            id,
                                            componentKey,
                                            name: action.props.name,
                                            handler,
                                            args,
                                            headers,
                                        }
                                    );
                                    return res;
                                } catch (err) {
                                    const errObj = new Error(err.message);
                                    Object.assign(errObj, err);
                                    extendState({ error: errObj });
                                    throw err;
                                }
                            },
                        });
                    },
                    {}
                );
            });

        const { props, error } = component || {};
        const onTimeout = () => {};

        useEffect(() => {
            let to;
            let onRender;
            let onError;
            let onLog;
            if (
                open &&
                !props &&
                !error &&
                !loadingStates[`${scope}:${componentKey}`]
            ) {
                to = setTimeout(onTimeout, 15000);
                loadingStates[`${scope}:${componentKey}`] = true;
                onRender = async (event) => {
                    try {
                        const eventData = await consume(event);
                        if (eventData === 'ping') return;

                        /** TODO: fix base scope === 'public' */
                        if (
                            eventData.action === 'render' &&
                            eventData.key === componentKey
                        ) {
                            const data = parseSocketResponse(eventData);
                            const { error, ...rest } = internalState;
                            setState({
                                ...rest,
                                component: data,
                                loading: false,
                            });
                        }
                    } catch (e) {
                        orgLogger.error`Error in render result ${e}.`;
                    }
                };
                onMessage(socket, onRender);

                /* I'm not sure if this is the proper place to handle errors from a component. There's no serverside mechanism that sends error messages from components */
                onError = async (event) => {
                    const data = await consume(event);
                    if (data === 'ping') return;

                    if (data.type === 'error' && data.key === componentKey) {
                        const err = await parseSocketResponse(data);
                        const errObj = new Error(err.message);
                        Object.assign(errObj, err);
                        extendState({ error: errObj, loading: false });
                    }
                };
                onMessage(socket, onError);

                onLog = (data) => {
                    data.tag[0].raw = 'Fake Tagged Template String Arg';
                    orgLogger
                        .scope(data.scope)
                        .setMessageLevel(data.level)
                        .log(...data.tag);
                };
                on(socket, 'log', onLog);

                emit(socket, {
                    action: EVENT_USE_COMPONENT,
                    key: componentKey,
                    scope: scope || 'base',
                    props: clientProps,
                    options: { ...rest },
                    headers,
                });

                setLoading(true);
            }

            // secOpen.forEach((open, i) => {
            //     if (open) {
            //         const socket = sockets[i];
            //         emit(socket, {
            //             action: EVENT_USE_COMPONENT,
            //             key: componentKey,
            //             scope: scope || 'base',
            //             options: { ...rest },
            //         });
            //     }
            // });

            () => {
                off(socket, 'message', onRender);
                off(socket, 'message', onError);
                off(socket, 'message', onLog);
                setLoading(false);
            };
        }, [open]);

        useEffect(() => {
            if (open && !error) {
                emit(socket, {
                    action: EVENT_USE_COMPONENT,
                    key: componentKey,
                    scope: scope || 'base',
                    props: clientProps,
                    options: { ...rest },
                    headers,
                });
                setLoading(true);
            }
        }, [headers?.Authorization]);

        useEffect(() => {
            if (strict && error) {
                throw new Error(error);
            }
        }, [error]);

        if (internalState.error && !component && !rendered) {
            return internalState;
        }

        if (componentState instanceof Error) {
            throw componentState;
        }
        if (!component && internalState.loading) {
            if (suspend) {
                throw new Promise(() => {});
            } else {
                return defaultState;
            }
        }

        return {
            ...(rendered || {}),
            ...componentState,
            ...internalState,
            resolved,
        };
    } catch (e) {
        if (!ctx)
            throw new Error(
                'No available context. Are you missing a Provider?'
            );
        throw e;
    }
};

// export const useServerAtom = (atm, clientDefaultValue, options) => {
//     const { useAtom } = useContext(context);

//     const [state, setState] = useServerState(clientDefaultValue, options);
//     const [value, setAtomValue] = useAtom(atm);

//     useEffect(() => {
//         setAtomValue(state);
//     }, [state]);

//     return [value, setAtomValue];
// };

// const Test = () => {
//     useServerState('test', {
//         strict,
//     });
// };
