/// <reference types="react" />
export declare const authContext: import("react").Context<{
    id: any;
    signed: any;
}>;
export declare const AUTHENTICATE: import("@apollo/client").DocumentNode;
export declare const AuthProvider: ({ client }: {
    client: any;
}) => JSX.Element;
