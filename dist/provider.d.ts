/// <reference types="react" />
export declare const useClientContext: () => {};
export declare const useAuth: (useStrategy?: () => {
    authenticate: () => never;
    logout: () => void;
    id: any;
    strategy: any;
}, auto?: boolean) => {
    authenticate: (...args: any[]) => Promise<unknown>;
    register: (strategy: any) => Promise<unknown>;
    logout: () => Promise<void>;
};
export declare const Provider: (props: any) => JSX.Element;
