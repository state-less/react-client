import ReconnectingWebSocket from 'reconnecting-websocket';
export declare const parseSocketResponse: (data: {
    statusCode: number;
    body: string;
    message: string;
} | 'ping') => Record<string, any>;
export declare const emit: (socket: any, data: any) => void;
export declare const request: (socket: any, data: any) => Promise<unknown>;
export declare const on: (socket: any, event: any, fn: any) => void;
export declare const off: (socket: any, event: any, fn: any) => void;
export declare const onMessage: (socket: any, fn: any) => void;
export declare const consume: (event: any) => Promise<any>;
/**
 * Tracks server pings for determining if the connection dropped.
 * Will terminate non-responsive connections.
 * This close event should initiate the process of recreating the connection in the ws module manager (eg ws/user.js and modules/ws-user.js)
 * @see https://gist.github.com/thiagof/aba7791ef9504c1184769ce401f478dc
 *
 * Modified to work with WebSocket interface.
 */
export declare function setupWsHeartbeat(ws: ReconnectingWebSocket): void;
