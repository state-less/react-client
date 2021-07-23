import React, { useContext, useEffect, useMemo, useState } from 'react';
import { context } from './context';
// import ws from 'ws';
import { on, emit, consume, request } from './util';

import { atom, Provider as JotaiProvider } from 'jotai';
import { packageLogger } from './logger';
import { Web3Provider, web3Context } from './Web3';
import { useLocalStorage } from './hooks/jotai';
// import { web3Context, Web3UtilProvider } from '../../algo-trade-frontend/src/provider/Web3';

export const useClientContext = () => {
    const internalCtx = useContext(context);
    const web3Ctx = useContext(web3Context);
    return { ...internalCtx, ...web3Ctx }
}

let compId;
export const useAuth = (useStrategy, auto) => {
    const { open, socket, headers, setHeaders } = useContext(context);
    const { authenticate: auth, logout: deauth, id } = useStrategy();
    const [authed, setHasAuthed] = useState(false);
    useEffect(() => {
        (async () => {
            if (open && !authed) {
                const challenge = await request(socket, { action: 'auth', phase: 'challenge', headers});
                if (challenge.address) {
                    setHasAuthed(true);
                } else {
                    const newHeaders = {...headers};
                    delete newHeaders.Authorization;
                    
                    debugger;
                    setHeaders(newHeaders);
                }
                console.log ("AUTO LOGIN", challenge);
            }
        })()
    }, [open, authed]);

    async function authenticate() {
        const challenge = await request(socket, { action: 'auth', phase: 'challenge' });
        const data = await auth(challenge);
        if (data.success)
            try {
                const response = await request(socket, {
                    action: 'auth',
                    phase: 'response',
                    ...data
                });
                console.log("AUTH RESPONSE", response)
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
            if (id && compId !== id && authed) {
                compId = id;
                await logout();
            }
        })()
        return () => {
            compId = null;
        }
    }, [id])

    return { authenticate, logout };
}

const headerAtom = atom();
const _Provider = (props) => {
    const { urls = [], url, headers: staticHeaders = {}, useAtom } = props;
    const [open, setOpen] = useState(false);
    const [headers, setHeaders] = useLocalStorage('headers', headerAtom, staticHeaders)
    const [secOpen, setSecOpen] = useState(urls.map(() => false));
    const [error, setError] = useState(null);

    const allOpen = secOpen.reduce((all, cur) => all && cur, open);
    if (!url)
        throw new Error("Missing property 'url' in Provider props.");

    // const socket = useMemo(() => {
    //     return io(url);³
    // }, [url]);

    const socket = useMemo(() => {
        if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;


        const ws = new WebSocket(url);
        ws.addEventListener('open', function open() {
            console.log("connected")
            // ws.send(JSON.stringify({"action" : "render" , "message" : "Hello everyone"}));
            // ws.send(JSON.stringify({"action" : "useState" ,"key":"votes", "scope":"base"}));
            // console.log ("sent")
            setOpen(true);
        });
        ws.addEventListener('message', async (event) => {
            const data = await consume(event);
        });

        return ws;
    }, [url, typeof window]);

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
        on(socket, 'error', () => {
            const message = logger.error`Connecting to socket ${url}.`
            setError(message);
        })
    }, []);


    return <context.Provider value={{ setHeaders, socket, sockets, open, secOpen, allOpen, useAtom, headers, error }}>
        <Web3Provider>
            {props.children}
        </Web3Provider>
    </context.Provider>
}

export const Provider = (props) => {
    return <JotaiProvider>
        <_Provider {...props} />
    </JotaiProvider>

}