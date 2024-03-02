/// <reference types="react" />
export declare const ssrContext: import("react").Context<{
    req: Request;
}>;
export declare const SSRProvider: ({ req, children }: {
    req: any;
    children: any;
}) => JSX.Element;
