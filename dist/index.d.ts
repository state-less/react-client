import { ApolloError } from '@apollo/client';
import { ApolloClient } from '@apollo/client/core';
export declare const RENDER_COMPONENT: import("@apollo/client").DocumentNode;
export declare const UPDATE_STATE: import("@apollo/client").DocumentNode;
export declare const UPDATE_COMPONENT: import("@apollo/client").DocumentNode;
export declare const GET_STATE: import("@apollo/client").DocumentNode;
export declare const SET_STATE: import("@apollo/client").DocumentNode;
export declare const CALL_FUNCTION: import("@apollo/client").DocumentNode;
type UseServerStateOptions = {
    /** The *unique* serverside key of the state. */
    key: string;
    /** The scope of the state. A state with the same key can exist in different scopes */
    scope: string;
    initialValue?: any;
    client?: ApolloClient<any>;
};
type UseComponentOptions = {
    /** The *unique* serverside key of the component. */
    key: string;
    client?: ApolloClient<any>;
    props?: any;
};
type UseServerStateInfo = {
    error: ApolloError;
    loading: boolean;
};
export declare const useComponent: (key: string, options: UseComponentOptions) => [any, {
    error: ApolloError | Error;
    loading: boolean;
}];
export declare const CallFunctionFactory: (actualClient: ApolloClient<any>, val: {
    component: string;
    name: string;
}, data: any) => (...args: any[]) => Promise<void>;
export declare const useServerState: <ValueType>(initialValue: ValueType, options: UseServerStateOptions) => [ValueType, (value: ValueType) => void, UseServerStateInfo];
export {};
