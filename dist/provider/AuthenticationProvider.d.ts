/// <reference types="react" />
export declare const authContext: import("react").Context<{
    id: any;
    signed: any;
    authenticate: any;
}>;
export declare const AUTHENTICATE: import("@apollo/client").DocumentNode;
export declare const AuthProvider: ({ children, client }: {
    children: any;
    client: any;
}) => JSX.Element;
