import React, { useEffect, useMemo, useState } from 'react';
import { context } from './context';
// import ws from 'ws';
import {on, emit, consume} from './util';

import {Provider as JotaiProvider} from 'jotai';
import {packageLogger} from './logger';

export const Provider = (props) => {
    const {urls = [], url, useAtom} = props;
    const [open, setOpen] = useState(false);
    const [secOpen, setSecOpen] = useState(urls.map(() => false));
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
            console.log ("connected")
            // ws.send(JSON.stringify({"action" : "render" , "message" : "Hello everyone"}));
            // ws.send(JSON.stringify({"action" : "useState" ,"key":"votes", "scope":"base"}));
            // console.log ("sent")
            setOpen(true);
        });
        ws.addEventListener('message', async (event) => {
            const data = await consume(event);
            packageLogger.info`Received message from websocket. ${data}`
        });
        
        return ws;
    }, [url, typeof window]);

    const sockets = useMemo(() => {
        return urls.map((url, i) => {
            if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
            const ws = new WebSocket(url);
            ws.addEventListener('open', function open() {
                console.log ("connected")
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
                packageLogger.info`Received message from websocket. ${data}`
            });
            return ws;
        })
    }, [typeof window]);
    useEffect(() => {
        on(socket, 'error', () => {
            const message = logger.error`Connecting to socket ${url}.`
            throw new Error(message);
        }) 
    },[]);
    return <context.Provider value={{socket,sockets, open, secOpen, allOpen, useAtom}}>
        <JotaiProvider>
            {props.children}
        </JotaiProvider>
    </context.Provider>
}