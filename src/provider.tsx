import React, { useContext, useEffect, useMemo, useState } from 'react';
import { atom, Provider as JotaiProvider } from 'jotai';

import { context } from './context';
import { on, consume, request, setupWsHeartbeat } from './lib/util/socket';

import { orgLogger } from './lib/logger';
import { Web3Provider, web3Context } from './Web3';
import { useLocalStorage } from './hooks/jotai';
import jwt from 'jsonwebtoken';
import ReconnectingWebsocket from 'reconnecting-websocket';

export const useClientContext = () => {
    const internalCtx = useContext(context) as object;
    const web3Ctx = useContext(web3Context) as object;
    return { ...internalCtx, ...web3Ctx };
};

let compId;

const useNoopStrat = () => {
    return {
        authenticate: () => {
            throw new Error('Cannot call authenticate without a strategy.');
        },
        logout: () => {
            console.warn('Performing logout without strategy');
        },
        id: null,
        strategy: null,
    };
};

type AuthResult = {
    success: boolean;
    response: any;
};
type Strategy = {
    authenticate(challenge: any): AuthResult;
    logout(): void;
    id: string;
    strategy: string;
};
export const useAuth = (useStrategy = useNoopStrat, auto = false) => {
    const { open, socket, headers, setHeaders, setIdentity, identity } =
        useContext(context);
    const {
        authenticate: auth,
        logout: deauth,
        id,
        strategy,
    }: Strategy = useStrategy();
    const [authed, setHasAuthed] = useState(false);
    useEffect(() => {
        (async () => {
            if (open && !authed && auto) {
                const challenge = (await request(socket, {
                    action: 'auth',
                    phase: 'challenge',
                    headers,
                })) as any;
                if (challenge.address) {
                    setHasAuthed(true);
                } else {
                    const newHeaders = { ...headers };
                    delete newHeaders.Authorization;

                    debugger;
                    setHeaders(newHeaders);
                    setIdentity(null);
                }
            }
        })();
    }, [open, authed]);

    useEffect(() => {
        if (!headers?.Authorization) return;

        const identity = jwt.decode(headers.Authorization.split(' ')[1]);
        const timeValid = identity.exp * 1000 - +new Date();

        const to = setTimeout(() => {
            orgLogger.info`"JWT Expired. Logging out.`;
            logout();
        }, timeValid);

        setIdentity(identity);

        return () => {
            clearTimeout(to);
        };
    }, [headers?.Authorization]);

    async function authenticate(...args) {
        const challenge = await request(socket, {
            action: 'auth',
            phase: 'challenge',
            strategy,
            headers,
        });
        const data = await auth.apply(this, [challenge, ...args]);
        if (data.success)
            try {
                const response = await request(socket, {
                    action: 'auth',
                    phase: 'response',
                    ...data,
                });

                if (response) {
                    setHasAuthed(true);
                    setHeaders({
                        ...headers,
                        Authorization: `Bearer ${response}`,
                    });
                } else {
                    const newHeaders = { ...headers };
                    delete newHeaders.Authorization;

                    setHeaders(newHeaders);
                    setIdentity(null);
                }
                return response;
            } catch (e) {
                throw e;
            }
    }

    async function register(strategy) {
        const response = await request(socket, {
            action: 'auth',
            phase: 'register',
            strategy,
            headers,
        });

        if (response)
            try {
                setHeaders({
                    ...headers,
                    Authorization: `Bearer ${response}`,
                });
                setHasAuthed(true);
                return response;
            } catch (e) {
                throw e;
            }
    }
    async function logout() {
        const { Authorization, ...rest } = headers;
        await deauth();
        setHeaders(rest);
        setIdentity(null);
    }

    useEffect(() => {
        (async () => {
            if (id && compId && compId !== id && authed) {
                compId = id;
                await logout();
            }
        })();
        // return () => {
        //     compId = null;
        // }
    }, [id]);

    return { authenticate, register, logout };
};

const headerAtom = atom({});

const SocketManager = (url) => {
    const ws = new WebSocket(url);

    ws.addEventListener('open', function open() {});

    ws.addEventListener('close', function open() {});
};
const MainProvider = (props) => {
    const { urls = [], url, headers: staticHeaders = {}, useAtom } = props;
    const [open, setOpen] = useState(false);
    const [headers, setHeaders] = useLocalStorage(
        'headers',
        headerAtom,
        staticHeaders
    );
    const [secOpen, setSecOpen] = useState(urls.map(() => false));
    const [error, setError] = useState(null);
    const [identity, setIdentity] = useState(null);
    const allOpen = secOpen.reduce((all, cur) => all && cur, open);

    if (!url) throw new Error("Missing property 'url' in Provider props.");

    const socket = useMemo(() => {
        if (
            typeof window === 'undefined' ||
            typeof ReconnectingWebsocket === 'undefined'
        )
            return;

        const ws = new ReconnectingWebsocket(url);

        setupWsHeartbeat(ws);

        ws.addEventListener('open', () => {
            orgLogger.warning`Socket connection initialized.`;

            setOpen(true);
        });

        ws.addEventListener('close', () => {
            orgLogger.warning`Socket connection lost. Reconnecting.`;
            setOpen(false);
        });
        return ws;
    }, [url, typeof window]);

    const sockets = useMemo(() => {
        // return urls.map((url, i) => {
        //     if (
        //         typeof window === 'undefined' ||
        //         typeof ReconnectingWebsocket === 'undefined'
        //     )
        //         return;
        //     const ws = new ReconnectingWebsocket(url);
        //     ws.addEventListener('open', function open() {
        //         console.log('connected');
        //         // ws.send(JSON.stringify({"action" : "render" , "message" : "Hello everyone"}));
        //         // ws.send(JSON.stringify({"action" : "useState" ,"key":"votes", "scope":"base"}));
        //         // console.log ("sent")
        //         // setOpen(true);
        //         setSecOpen((secOpen) => {
        //             const updated = [...secOpen];
        //             updated[i] = true;
        //             setSecOpen(updated);
        //         });
        //     });
        //     ws.addEventListener('message',  (event) => {
        //         const data = await consume(event);
        //     });
        //     return ws;
        // });
        return [];
    }, [typeof window]);

    useEffect(() => {
        if (!socket) return;
        on(socket, 'error', () => {
            const message = orgLogger.error`Error connecting to socket ${url}.`;
            setError(message);
        });
    }, [socket]);

    return (
        <context.Provider
            value={{
                setIdentity,
                identity,
                setHeaders,
                socket,
                sockets,
                open,
                secOpen,
                allOpen,
                headers,
                error,
            }}
        >
            <Web3Provider>{props.children}</Web3Provider>
        </context.Provider>
    );
};

export const Provider = (props) => {
    return (
        <JotaiProvider>
            <MainProvider {...props} />
        </JotaiProvider>
    );
};
