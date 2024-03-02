import React from 'react';
export declare const ssrContext: React.Context<{
    req: Request;
}>;
export declare const SSRProvider: ({ req, children }: {
    req: any;
    children: any;
}) => JSX.Element;
