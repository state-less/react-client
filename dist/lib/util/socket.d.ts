export declare const parseSocketResponse: (data: any) => any;
export declare const emit: (socket: any, data: any) => void;
export declare const request: (socket: any, data: any) => Promise<unknown>;
export declare const on: (socket: any, event: any, fn: any) => void;
export declare const off: (socket: any, event: any, fn: any) => void;
export declare const onMessage: (socket: any, fn: any) => void;
export declare const consume: (event: any) => Promise<any>;
