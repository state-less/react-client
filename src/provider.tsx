/* eslint-disable no-unused-expressions */
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { atom, Provider as JotaiProvider } from 'jotai';

import jwt from 'jsonwebtoken';
import ReconnectingWebsocket from 'reconnecting-websocket';
import { ClientContext, context } from './context';
import { on, request, setupWsHeartbeat } from './lib/util/socket';

import { orgLogger } from './lib/logger';
import { Web3Provider, web3Context, Web3Context } from './Web3';
import { useLocalStorage } from './hooks/jotai';
import { assertGetSingleHost } from './lib/util';

export const useClientContext = (): ClientContext & Web3Context => {
    const internalCtx = useContext(context);
    const web3Ctx = useContext(web3Context);
    return { ...internalCtx, ...web3Ctx };
};

let compId;

const useNoopStrat = () => {
    return {
        authenticate: () => {
            throw new Error('Cannot call authenticate without a strategy.');
        },
        logout: () => {
            orgLogger.warning`Performing logout without strategy`;
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
export const useAuth = (
    useStrategy = useNoopStrat,
    { auto = false, host = null }
) => {
    const { open, sockets, headers, setHeaders, setIdentity, identity } =
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

                    setHeaders(newHeaders);
                    setIdentity(null);
                }
            }
        })();
    }, [open, authed]);

    useEffect(() => {
        if (!headers?.Authorization) return;

        const decoded = jwt.decode(headers.Authorization.split(' ')[1]);
        const timeValid = decoded.exp * 1000 - +new Date();

        const to = setTimeout(() => {
            orgLogger.info`"JWT Expired. Logging out.`;
            logout();
        }, timeValid);

        setIdentity(decoded);

        // eslint-disable-next-line consistent-return
        return () => {
            clearTimeout(to);
        };
    }, [headers?.Authorization]);

    // eslint-disable-next-line no-param-reassign
    host = assertGetSingleHost(sockets, host);
    const socket = sockets[host];

    async function authenticate(...args) {
        const challenge = await request(socket, {
            action: 'auth',
            phase: 'challenge',
            strategy,
            headers,
        });
        const data = await auth.apply(this, [challenge, ...args]);

        let response;
        if (data.success) {
            response = await request(socket, {
                action: 'auth',
                phase: 'response',
                ...data,
            });
        }

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
    }

    // eslint-disable-next-line no-shadow
    async function register(strategyName: string) {
        const response = await request(socket, {
            action: 'auth',
            phase: 'register',
            strategy: strategyName,
            headers,
        });

        if (response) {
            setHeaders({
                ...headers,
                Authorization: `Bearer ${response}`,
            });
            setHasAuthed(true);
        }
        return response;
    }
    async function logout() {
        const { Authorization, ...rest } = headers;
        setHeaders(rest);
        setIdentity(null);
        request(socket, {
            action: 'logout',
        });
        deauth();
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
    const { hosts = {}, headers: staticHeaders = {}, children } = props;
    const [open, setOpen] = useState(false);
    const [headers, setHeaders] = useLocalStorage(
        'headers',
        headerAtom,
        staticHeaders
    );

    const [error, setError] = useState(null);
    const [identity, setIdentity] = useState(null);

    if (!hosts) throw new Error("Missing property 'hosts' in Provider.");

    const sockets = useMemo(() => {
        if (
            typeof window === 'undefined' ||
            typeof ReconnectingWebsocket === 'undefined'
        )
            return;

        const hostNames = Object.keys(hosts);

        const localSocketInstances = hostNames.reduce((acc, key) => {
            const url = hosts[key];
            orgLogger.info`Initializeing socket connection to: ${url}.`;

            const ws = new ReconnectingWebsocket(url);

            on(ws, 'open', () => {
                orgLogger.debug`Socket connection initialized.`;
                setOpen(true);
            });

            on(ws, 'close', () => {
                orgLogger.debug`Socket connection lost. Reconnecting.`;
                setOpen(false);
            });

            on(ws, 'error', () => {
                const message = orgLogger.error`Error connecting to socket ${url}.`;
                setOpen(false);
                setError(message);
            });

            setupWsHeartbeat(ws);

            return {
                [key]: ws,
                ...acc,
            };
        }, {});

        // eslint-disable-next-line consistent-return
        return localSocketInstances;
    }, [JSON.stringify(hosts)]);

    const providerValue = useMemo(() => {
        return {
            setIdentity,
            identity,
            setHeaders,
            sockets,
            open,
            headers,
            error,
        };
    }, [identity, setHeaders, hosts, open, headers, error]);

    return (
        <context.Provider value={providerValue}>
            <Web3Provider>{children}</Web3Provider>
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
