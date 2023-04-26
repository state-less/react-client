import { ApolloClient } from '@apollo/client';
import { PropsWithChildren } from 'react';
import React from 'react';
export declare const authContext: React.Context<{
    session: import("../lib/types").Session;
    authenticate: any;
    logout: any;
}>;
export declare const AUTHENTICATE: import("@apollo/client").DocumentNode;
export declare const AuthProvider: ({ children, client, }: PropsWithChildren<{
    client?: ApolloClient<any>;
}>) => JSX.Element;
