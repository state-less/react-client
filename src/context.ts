import React, { createContext } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

type Identity = Record<string, any>;
type Headers = Record<string, any>;

type ClientContext = {
    socket: ReconnectingWebSocket;
    sockets: ReconnectingWebSocket[];
    open: boolean;
    /** @deprecated */
    secOpen: boolean[];
    allOpen: boolean;
    headers: Headers;
    setHeaders: (headers: Headers) => void;
    identity: Identity | null;
    setIdentity: (id: Identity) => void;
    error?: Error;
};
export const context: React.Context<ClientContext> = createContext({
    socket: null,
    sockets: [],
    secOpen: [],
    open: false,
    allOpen: false,
    headers: {},
    setHeaders: () => {},
    identity: null,
    setIdentity: () => {},
    error: null
});
