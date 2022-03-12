import React from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
/** We only support Ethereum BSC and Ganache right now */
export declare const injected: InjectedConnector;
export declare type Web3Context = {
    /** TODO: fix return types */
    activateInjected: () => Promise<unknown>;
    sign: (message: string, signerAccount: string) => Promise<any>;
    recover: (message: any, sig: any) => Promise<any>;
    verify: (account: any, message?: string) => Promise<boolean>;
    deactivate: () => void;
    active: boolean;
    account: string;
    error: Error;
};
export declare const web3Context: React.Context<Web3Context>;
export declare const Web3UtilProvider: ({ children, autoActivate }: {
    children: any;
    autoActivate?: boolean;
}) => JSX.Element;
export declare const Web3Provider: ({ children, ...rest }: {
    [x: string]: any;
    children: any;
}) => JSX.Element;
