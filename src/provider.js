import React, { useContext, useEffect, useMemo, useState } from 'react';
import { context } from './context';
// import ws from 'ws';
import { on, emit, consume, request } from './util';

import { atom, Provider as JotaiProvider } from 'jotai';
import { orgLogger, packageLogger } from './logger';
import { Web3Provider, web3Context } from './Web3';
import { useLocalStorage } from './hooks/jotai';
import jwt from 'jsonwebtoken'
// import { web3Context, Web3UtilProvider } from '../../algo-trade-frontend/src/provider/Web3';

export const useClientContext = () => {
    const internalCtx = useContext(context);
    const web3Ctx = useContext(web3Context);
    return { ...internalCtx, ...web3Ctx }
}

let compId;
export const useAuth = (useStrategy, auto) => {
    const { open, socket, headers, setHeaders, setIdentity, identity } = useContext(context);
    const { authenticate: auth, logout: deauth, id, strategy } = useStrategy();
    const [authed, setHasAuthed] = useState(false);
    useEffect(() => {
        (async () => {
            if (open && !authed) {
                const challenge = await request(socket, { action: 'auth', phase: 'challenge', headers });
                if (challenge.address) {
                    setHasAuthed(true);
                } else {
                    const newHeaders = { ...headers };
                    delete newHeaders.Authorization;

                    debugger;
                    setHeaders(newHeaders);
                    setIdentity(null);
                }
                console.log("AUTO LOGIN", challenge);
            }
        })()
    }, [open, authed]);

    useEffect(() => {
        if (!headers?.Authorization)
            return

        const identity = jwt.decode(headers.Authorization.split(' ')[1]);
        const timeValid = (identity.exp * 1000) - +new Date;

        const to = setTimeout(() => {
            orgLogger.info`"JWT Expired. Logging out.`;
            logout()
        }, timeValid);

        console.log("Setting identity", identity, timeValid);
        setIdentity(identity)

        return () => {
            clearTimeout(to);
        }
    }, [headers?.Authorization]);

    async function authenticate(...args) {
        const challenge = await request(socket, { action: 'auth', phase: 'challenge', strategy });
        const data = await auth(challenge, ...args);
        if (data.success)
            try {
                const response = await request(socket, {
                    action: 'auth',
                    phase: 'response',
                    ...data
                });

                setHeaders({
                    ...headers,
                    Authorization: `Bearer ${response}`
                });



                setHasAuthed(true);
                return response;
            } catch (e) {
                throw e;
            }
    }

    async function register(strategy) {
        const response = await request(socket, { action: 'auth', phase: 'register', strategy, headers });

        if (response)
            try {
                setHeaders({
                    ...headers,
                    Authorization: `Bearer ${response}`
                });
                setHasAuthed(true);
                return response;
            } catch (e) {
                throw e;
            }
    }
    function logout() {
        const { Authorization, ...rest } = headers;
        debugger;
        deauth();
        setHeaders(rest);
    }

    useEffect(() => {
        (async () => {
            if (id && compId && (compId !== id) && authed) {
                compId = id;
                await logout();
            }
        })()
        // return () => {
        //     compId = null;
        // }
    }, [id])

    return { authenticate, register, logout };
}

const headerAtom = atom();
const MainProvider = (props) => {
    const { urls = [], url, headers: staticHeaders = {}, useAtom } = props;
    const [open, setOpen] = useState(false);
    const [headers, setHeaders] = useLocalStorage('headers', headerAtom, staticHeaders)
    const [secOpen, setSecOpen] = useState(urls.map(() => false));
    const [error, setError] = useState(null);
    const [identity, setIdentity] = useState(null);
    const allOpen = secOpen.reduce((all, cur) => all && cur, open);

    if (!url)
        throw new Error("Missing property 'url' in Provider props.");

    const [socket, setSocket] = useState(null);
    useEffect(() => {
        if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
        if (open) return;

        const ws = new WebSocket(url);
        console.log("OPENING SOCKET", ws)
        ws.addEventListener('open', function open() {
            setOpen(true);
        });

        ws.addEventListener('close', function open() {
            setOpen(false);
        });
        // ws.addEventListener('message', async (event) => {
        //     const data = await consume(event);
        // });

        setSocket(ws);
    }, [url, typeof window, open])
    
    const sockets = useMemo(() => {
        return urls.map((url, i) => {
            if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
            const ws = new WebSocket(url);
            ws.addEventListener('open', function open() {
                console.log("connected")
                // ws.send(JSON.stringify({"action" : "render" , "message" : "Hello everyone"}));
                // ws.send(JSON.stringify({"action" : "useState" ,"key":"votes", "scope":"base"}));
                // console.log ("sent")
                // setOpen(true);
                setSecOpen((secOpen) => {
                    const updated = [...secOpen];
                    updated[i] = true;
                    setSecOpen(updated);
                })
            });
            ws.addEventListener('message', async (event) => {
                const data = await consume(event);
            });
            return ws;
        })
    }, [typeof window]);
    useEffect(() => {
        if (!socket) return;
        on(socket, 'error', () => {
            const message = logger.error`Connecting to socket ${url}.`
            setError(message);
        })
    }, [socket]);


    return <context.Provider value={{ setIdentity, identity, setHeaders, socket, sockets, open, secOpen, allOpen, useAtom, headers, error }}>
        <Web3Provider>
            {props.children}
        </Web3Provider>
    </context.Provider>
}

export const Provider = (props) => {
    return <JotaiProvider>
        <MainProvider {...props} />
    </JotaiProvider>

}