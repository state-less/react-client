import React from 'react';
export declare const authContext: React.Context<{
    session: {
        id: any;
        token: any;
        strategy: any;
        strategies: any;
    };
    authenticate: any;
}>;
export declare const AUTHENTICATE: import("@apollo/client").DocumentNode;
export declare const AuthProvider: ({ children, client }: {
    children: any;
    client: any;
}) => JSX.Element;
