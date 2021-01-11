import React, { createContext, useEffect, useState, useContext, useMemo } from 'react';
import { EVENT_ERROR, EVENT_CREATE_STATE, EVENT_DELIM, EVENT_SET_STATE, EVENT_USE_STATE, DEFAULT_SCOPE, EVENT_EXECUTE_ACTION, EVENT_USE_COMPONENT } from './consts';
import { context } from './context';
import {atom, useAtom} from 'jotai';
import baseLogger, { orgLogger } from './logger';
import {v4} from 'uuid';
import { useTraceUpdate } from './debug';
import packageLogger from './logger';
import {on, onMessage, emit, consume, off} from './util';

let stateCount = 0;

const increaseCount = () => stateCount++;
const join = delim => (...strings) => strings.join(delim);
const genEventName = join(EVENT_DELIM);
const genIdEventName = event => id => genEventName(event, id);
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

const alignArgs = (length, ...def) => (...args) => {
    const nargs = [...args];
    for (var i=length; i > def.length; i--) {
        if (!args[i-1]) {
            nargs[i-1] = args[i- 2] ;
            nargs[i-2] = def[i-2];
        }
    }
    return nargs;
}

const alignUseServerStateArgs = alignArgs(2, null);

const atoms = new Map();

const useStore = (store, key) => {
    const [atom, setAtom] = useState(null);
};


const useServerStateLogger = packageLogger.scope('hooks:useServerState');
export const useServerState = (clientDefaultValue, options) => {
  var [clientDefaultValue, options] = alignUseServerStateArgs(clientDefaultValue, options);
  const {
    key,
    strict = false,
    defaultValue,
    defer = false,
    value = defaultValue,
    scope = DEFAULT_SCOPE,
    suspend = false,
    ...rest
  } = options
    const ctx = useContext(context);
    try {
        const {socket, open} = ctx;
        const debugProps = useMemo(() => ({clientDefaultValue, options}))
        const defaultState = useMemo(() => ({value: clientDefaultValue, id: null, scope, key}));
        let atm;
        
        if (!atoms.has(`${scope}:${key}`)) {
            atm = atom({defaultState, clientId: increaseCount()})
            atoms.set(`${scope}:${key}`, atm);
        } else {
            atm = atoms.get(`${scope}:${key}`)
        }
        
        
        const removeAllListeners = useMemo(() => false && socket.removeAllListeners.bind(socket), [socket]);
        
        const [state, setState] = useAtom(atm);

        const {clientId} = state;

        const [loading, setLoading] = useState(false);

        const extendState = data => console.log(new Error('setState')) || setState({...state, ...data});
        
        const {id, error} = state;
        const setStateEvent = useMemo(() => genSetStateEventName(id), [id]);
        const createStateEvent = useMemo(() => genCreateStateEventName(clientId), [clientId]);
        const errorEvent = useMemo(() => genErrorEventName(clientId), [clientId]);

        const onTimeout = () => {
            setState((state) => {
                const id = state.id;
                if(!id) {
                    return {
                        ...state,
                        error: new Error('Cancelling state due to timeout')
                    }
                }
                return state;
            })

            setLoading(false);
        }

        useEffect(() => {
            let to;
            baseLogger.warning`Rerendering useState ${key} ${clientDefaultValue}`
            if (open && !id && !error && !loading && !defer) {
                useServerStateLogger.error(`Requesting state. ${key}. ${socket}. Deferred ${defer}`)
                var onSetValue = async (event) => {
                    const eventData = await consume(event);
                    const data = parseSocketResponse(eventData);
                    if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id)) {
                        logger.warning`Received live event ${eventData.action} own id: ${state.id} data id ${data.id} client id ${clientId} value id: ${eventData.requestId} ${JSON.stringify(state)}`;
                        logger.warning`Parsed state live data ${data}. Setting state. ${{...state, ...data, id: 'foo'}}`;
                        setState((state) => {
                            return {...state, ...data}
                        });
                    }
                    // setState(() => {
                    //     return data;
                    // });
                };
                onMessage(socket,onSetValue);
                on(socket, errorEvent, ({error}) => extendState({error: new Error(error)}));
                useServerStateLogger.debug`Emitting ${EVENT_USE_STATE} ${defer} ${JSON.stringify(options)} ${clientDefaultValue}`
                emit(socket, {action: EVENT_USE_STATE, key, value,scope, requestId: clientId, options: {...rest}});
                setLoading(to);
            } 
            
            clearTimeout(loading);
            return () => {
                useServerStateLogger.error(`Removing listener setValue for ${key}.`)
                off(socket, 'message', onSetValue);
                // [createStateEvent].forEach(event => socket.removeAllListeners(event));
            }
        }, [open, defer])
        
        useEffect(() => {
            if (id) {
                baseLogger.debug`Adding Removing state listener ${id} ${key} for event ${setStateEvent}.`;
                if (!defer && id) {
                    var onSetValue = async () => {
                        baseLogger.warning`ON SET VALUE CALLED!! ${id}`;
                        const eventData = await consume(event);
                        const data = parseSocketResponse(eventData);
                        logger.warning`Received live event ${eventData.action} own id: ${state.id} data id ${data.id} client id ${clientId} value id: ${eventData.requestId} ${JSON.stringify(state)}`;
                        if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id)) {
                            logger.warning`Parsed state live data ${data}. Setting state. ${{...state, ...data, id: 'foo'}}`;
                            setState((state) => {
                                return {...state, ...data}
                            });
                        }
                    }
                    on(socket, 'message', onSetValue)
                    //ERROR STATE LISTENER
                    // socket.on(setStateEvent, (...args) => {
                    //     baseLogger.warning`state listener received ${setStateEvent} for state ${key}`;
                        
                    //     if (args[0]?.error) {
                    //         args[0].error = new Error(args[0].error.message);
                    //         args[0].error.stack = args[0].error.stack;
                    //         baseLogger.debug`Recreating Error instance. ${args[0].error}`
                    //     }
                    //     baseLogger.info`Setting state ${key} to ${args}. Is error: ${Object.keys(args[0])} ${args[0].error}`;
                    //     return extendState(...args);
                    // });
                }
            }
            return () => {
                if (id) {
                    baseLogger.debug`Removing state listener ${key} for event setValue`;
                    off(socket, 'message', onSetValue)
                    // [setStateEvent].forEach(event => socket.removeAllListeners(event));
                }
            }
        });

        useEffect(() => {
            if (strict && error) {
                throw error;
            }
        }, [error]);

        useEffect(() => {
            // if (id || error) {
                setLoading(false);
            // }
        }, [id, error, key]);

        const setServerState = (value) => { 
            socket.emit(EVENT_SET_STATE, {
                id,
                key,
                value,
            },{
                scope
            })
        }
        
        if (state.error) {
            if (strict) {
                throw new Error(state.error);
            }
            return [state.error, state.value];
        }

        if (suspend && !state.value && loading && !id ) {
            // return [state.value, createStateEvent];
            throw new Promise(Function.prototype)

        }
        
        if (!key && options.defer) {
            baseLogger.debug`Returning deferred value ${key} with options ${options} ${clientDefaultValue}`
            return [clientDefaultValue || null];
        }

        // baseLogger.debug`Returning live state ${state} ${key} with value ${state.value} ${clientDefaultValue}`
        return [state.value || clientDefaultValue, setServerState];
    } catch (e) {
        if (!ctx) throw new Error ('No available context. Are you missing a Provider?');
        throw e;
    }
}


export const useResponse = (fn, action, keepAlive) => {
    const ctx = useContext(context);

    const {socket} = ctx;

    const [id, setId] = useState(null);

    useEffect(() => {
        if (!id) return;
        socket[keepAlive?'on':'once']('executeAction:' + id, (componentKey, actionId, id, result) => {
            fn(result);
        })
    }, [id]);

    return (...args) => {
        const id = action(...args, id);
        setId(id);
    };
}
const componentAtoms = new Map();
/**
 * useComponent - Hook that renders serverside components
 * @param {*} clientDefaultValue 
 * @param {*} options 
 */

const parseSocketResponse = (data) => {
    const {body, statusCode, message} = data;
    baseLogger.debug`Parsing render result. Body: ${body}`;

    if (statusCode !== 200) {
        throw new Error(message || 'Internal Server Error');
    }

    try {
        const parsed = JSON.parse(body);
        return parsed;
    } catch (e) {
        const message = baseLogger.warning`Error parsing render result ${e}`;
        throw new Error(message);
    }
}

export const useComponent = (componentKey, options = {}) => {
  const {
    strict = false,
    suspend = true,
    scope = DEFAULT_SCOPE,
    ...rest
  } = options

    const ctx = useContext(context);
    const logAtom = useMemo(() => atom(), [componentKey]);
    const logger = useMemo(() => baseLogger.scope('useComponent'));
    try {
        const {socket, sockets, open} = ctx;
        const debugProps = useMemo(() => ({key: componentKey, options}))
        const defaultState = useMemo(() => ({component: componentKey, props: {}, scope, key: componentKey}));

        let atm;
        
        if (!componentAtoms.has(`${scope}:${componentKey}`)) {
            atm = atom({defaultState})
            componentAtoms.set(`${scope}:${componentKey}`, atm);
        } else {
            atm = componentAtoms.get(`${scope}:${componentKey}`)
        }
        
        const removeAllListeners = useMemo(() => false && socket.removeAllListeners.bind(socket), [socket]);
        
        const [internalState, setState] = useAtom(atm);
        const [loading, setLoading] = useState(false);
        
        const {
            component,
        } = internalState;
        
        // logger.info`Rerendering live useComponent hook. ${componentKey} ${JSON.stringify(component)}`
        const [componentState] = useServerState(component, {
            key: componentKey,
            scope: ['public'],
            defer: !component,
        });
        // useTraceUpdate(internalState);
        
        const resolved = {};
        const keys = Object.keys((componentState||{}).props||{});
        keys.length = 10;

        // logger.info`Processing props. ${keys}`

        for (const propKey of keys) {
            const serverProps = componentState?.props || {};
            const state = serverProps[propKey] || {};
            // logger.info`Processing props. ${propKey} ${state}`

            const resolvedState =  useServerState(state.value, {
                key: state.key,
                scope: ['public', state.scope],
                defer: !state.id || !state.key || !state.scope
            })
            if (state.id && state.key && state.scope) {
                if (resolvedState[0]) {
                    const [value, setValue] = resolvedState;
                    const setKey = `set${propKey[0].toUpperCase()}${propKey.slice(1)}`
                    resolved[propKey] = value;
                    resolved[setKey] = setValue;
                    logger.debug`Resolved state ${propKey} ${state.key} of component ${componentKey} to value ${value}`
                }
            }
        }
        logger.info`Resolved props ${resolved}. Children: ${componentState?.props?.children} Props ${componentState?.props}`
        // const actions = {}
        componentState?.props?.children?.filter((child) => {
            return child.component === 'Action';
        }).forEach((action) => {
            action.props.fns = action.props.handler.reduce((fns, handler) => {
                return Object.assign(fns, {
                    [handler]: (...args) => {
                        const id = v4();
                        emit(socket, {action: 'call', id, componentKey, name: action.props.name, handler, args});
                        return id;
                    }
                });
            },{});
            logger.debug`Using action handler ${action.props.fns}`

        })
        
        const extendState = data => setState({...internalState, ...data});
        
        const {props,error} = component || {};
        const componentEvent = useMemo(() => genComponentEvent(componentKey), [componentKey]);
        // const execActionEvent = useMemo(() => genActionEvent(clientId), [clientId]);
        const errorEvent = useMemo(() => genErrorEventName(componentKey), [componentKey]);

        const onTimeout = () => {
            // setState((state) => {
            //     const id = state.id;
            //     if(!id) {
            //         return {
            //             ...state,
            //             error: new Error('Cancelling state due to timeout')
            //         }
            //     }
            //     return state;
            // })

            setLoading(false);
        }

        useEffect(() => {
            let to;
            if (open && !props && !error && !loading) {
                to = setTimeout(onTimeout, 15000)
                onMessage(socket, async (event) => {
                    try {

                        const eventData = await consume(event);
                        logger.warning`Received render event ${eventData.action}`;
                        if (eventData.action === 'render') {
                            const data = parseSocketResponse(eventData);
                            logger.warning`Parsed render data ${data}. Setting state.`;
                            setState({...internalState, component: data});
                        }
                    } catch (e) {
                        logger.error`Error handling message. ${e}`
                    }
                });


                on(socket, 'log', (data) => {
                    data.tag[0].raw = 'Fake Tagged Template String Arg';
                    orgLogger.scope(data.scope).setMessageLevel(data.level).log(...data.tag)
                });

                emit(socket, {action: EVENT_USE_COMPONENT, key: componentKey, scope: scope || 'base', options: {...rest}});

                setLoading(to);
            } 
            
            // socket.on(EVENT_ERROR, (componentKey, id, message) => {
            //     if (componentKey === componentKey)
            //         setState({...internalState, foo:'bar',event: id, error: message})
            // });

            clearTimeout(loading);

            () => {
                [componentEvent, EVENT_ERROR].forEach(event => socket.removeAllListeners(event));
            }
        }, [open])
        
        // useEffect(() => {
        //     if (id) {
        //         if (id && !socket._callbacks[`$${setStateEvent}`]) {
        //             socket.on(setStateEvent, extendState);
        //         }
        //     }
        //     return () => {
        //         [setStateEvent, createStateEvent].forEach(event => socket.removeAllListeners(event));
        //     }
        // });

        useEffect(() => {
            if (strict && error) {
                throw new Error (error);
            }
        }, [error]);

        useEffect(() => {
                setLoading(false);
        }, [internalState.props, error]);


        // const setServerState = (value) => { 
        //     socket.emit(EVENT_SET_STATE, {
        //         id,
        //         key,
        //         value,
        //     },{
        //         scope
        //     })
        // }
        if ( componentState instanceof Error) {
            throw componentState;
        }
        if (!component && loading ) {
            return defaultState;
            throw new Promise(Function.prototype)
        }
        logger.error`WTF ${componentState?.error} ${internalState?.error}`
        return {...componentState, resolved};
    } catch (e) {
        if (!ctx) throw new Error ('No available context. Are you missing a Provider?');
        throw e;
    }
}


export const useServerAtom = (atm, clientDefaultValue, options) => {
    const {useAtom} = useContext(context);

    const [state, setState] = useServerState(clientDefaultValue, options);
    const [value,setAtomValue] = useAtom(atm);

    useEffect(() => {
        setAtomValue(state);
    }, [state]);

    return [value,setAtomValue];
}

const Test = () => {
    useServerState('test', {
        strict
    })
}

