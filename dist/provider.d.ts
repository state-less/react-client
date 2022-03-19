/// <reference types="react" />
import { ClientContext } from './context';
import { Web3Context } from './Web3';
export declare const useClientContext: () => ClientContext & Web3Context;
export declare const useAuth: (useStrategy: () => {
    authenticate: () => never;
    logout: () => void;
    id: any;
    strategy: any;
}, { auto, host }: {
    auto?: boolean;
    host?: any;
}) => {
    authenticate: (...args: any[]) => Promise<any>;
    register: (strategyName: string) => Promise<unknown>;
    logout: () => Promise<void>;
};
export declare const Provider: (props: any) => JSX.Element;
