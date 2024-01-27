import { ApolloError } from '@apollo/client';
import { ApolloClient, ApolloQueryResult, OperationVariables } from '@apollo/client/core';
export declare const RENDER_COMPONENT: import("@apollo/client").DocumentNode;
export declare const UNMOUNT_COMPONENT: import("@apollo/client").DocumentNode;
export declare const MOUNT_COMPONENT: import("@apollo/client").DocumentNode;
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
    client?: ApolloClient<any>;
    data?: any;
    props?: any;
};
type UseServerStateInfo = {
    error: ApolloError;
    loading: boolean;
};
export declare const useLocalStorage: <T>(key: string, initialValue: T, { cookie }?: {
    cookie?: any;
}) => [T, (val: T) => void];
export declare const renderComponent: (key: string, options: UseComponentOptions) => Promise<{
    data: any;
    error: ApolloError;
}>;
export declare const useComponent: (key: string, options?: UseComponentOptions) => [any, {
    error: ApolloError | Error;
    loading: boolean;
    refetch: (variables?: Partial<OperationVariables>) => Promise<ApolloQueryResult<{
        renderComponent: {
            rendered: any;
        };
    }>>;
}];
export declare const useServerState: <ValueType>(initialValue: ValueType, options: UseServerStateOptions) => [ValueType, (value: ValueType) => void, UseServerStateInfo];
export * from './provider/AuthenticationProvider';
