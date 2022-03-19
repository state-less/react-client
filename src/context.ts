import React, { createContext } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
import { noopSync } from './lib/util';

type Identity = Record<string, any>;
type Headers = Record<string, any>;

export type ClientContext = {
    sockets: Record<string, ReconnectingWebSocket>;
    open: boolean;
    headers: Headers;
    setHeaders: (headers: Headers) => void;
    identity: Identity | null;
    setIdentity: (id: Identity) => void;
    error?: Error;
};

export const context: React.Context<ClientContext> = createContext({
    sockets: {},
    open: false,
    headers: {},
    setHeaders: noopSync,
    identity: null,
    setIdentity: noopSync,
    error: null,
});
