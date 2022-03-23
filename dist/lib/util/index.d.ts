import ReconnectingWebSocket from 'reconnecting-websocket';
/**
 * Truncates the middle of a string.
 * @param str - The string to truncate
 * @param n - The number of characters to preserver
 * @returns
 */
export declare const truncateMid: (str: string, n?: number) => string;
export declare const noopSync: () => any;
declare type Hosts = Record<string, string>;
declare type Sockets = Record<string, ReconnectingWebSocket>;
export declare const isSingleHost: (hosts: Sockets) => boolean;
export declare const getSingleHost: (hosts: Sockets | Hosts) => string;
export declare const assertGetSingleHost: (sockets: Sockets, host: string) => string;
export {};
