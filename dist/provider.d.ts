/// <reference types="react" />
export declare const useClientContext: () => {};
export declare const useAuth: (useStrategy: any, auto?: boolean) => {
    authenticate: (...args: any[]) => Promise<unknown>;
    register: (strategy: any) => Promise<unknown>;
    logout: () => void;
};
export declare const Provider: (props: any) => JSX.Element;
