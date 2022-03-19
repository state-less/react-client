import React from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';
declare type Identity = Record<string, any>;
declare type Headers = Record<string, any>;
export declare type ClientContext = {
    sockets: Record<string, ReconnectingWebSocket>;
    open: boolean;
    headers: Headers;
    setHeaders: (headers: Headers) => void;
    identity: Identity | null;
    setIdentity: (id: Identity) => void;
    error?: Error;
};
export declare const context: React.Context<ClientContext>;
export {};
