import React, { useMemo, createContext, useEffect, useState } from 'react';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { Web3Provider as ETHWeb3Provider } from '@ethersproject/providers';
import { InjectedConnector } from '@web3-react/injected-connector';
import Web3 from 'web3';

/** We only support Ethereum BSC and Ganache right now */
export const injected = new InjectedConnector({
    supportedChainIds: [1, 56, 1337],
});

function getLibrary(provider, connector) {
    return new ETHWeb3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

export type Web3Context = {
    /** TODO: fix return types */
    activateInjected: () => Promise<unknown>;
    sign: (message: string, signerAccount: string) => Promise<any>;
    recover: (message: any, sig: any) => Promise<any>;
    verify: (account: any, message?: string) => Promise<boolean>;
    active: boolean;
    account: string;
    error: Error;
};

export const web3Context: React.Context<Web3Context> = createContext({
    activateInjected: null,
    sign: null,
    recover: null,
    verify: null,
    active: null,
    account: null,
    error: null,
});

export const Web3UtilProvider = ({ children, autoActivate = true }) => {
    const web3React = useWeb3React();
    const { activate, account, active, error, ...rest } = web3React;
    const [web3, setWeb3] = useState(null);

    const activateInjected = async () => activate(injected);

    useEffect(() => {
        if (!autoActivate) return;
        (async () => {
            await activate(injected);
        })();
    }, []);

    useEffect(() => {
        if (account) {
            const newWeb3 = new Web3(web3React?.library?.provider);
            setWeb3(newWeb3);
        }
    }, [account]);
    /**
     *
     * @param {*} web3 - The web3 instance
     * @param {string} message - The message to sign
     * @param {string} signerAccount - The account to sign with
     * @returns - The signature
     */
    async function sign(message: string, signerAccount: string) {
        if (!web3 && !signerAccount)
            throw new Error('Web 3 not yet loaded, please connect an account');
        let res;
        if (signerAccount) {
            const web3Instance = new Web3(web3React?.library?.provider);
            res = await web3Instance.eth.personal.sign(
                message,
                signerAccount,
                undefined
            );
        } else {
            res = await web3.eth.personal.sign(
                message,
                signerAccount,
                undefined
            );
        }
        return res;
    }

    /**
     * Recovers the account from a signed message
     * @param {*} web3
     * @param {*} message
     * @param {*} sig
     */
    async function recover(message, sig) {
        if (!web3)
            throw new Error('Web 3 not yet loaded, please connect an account');
        const res = await web3.eth.personal.ecRecover(message, sig);
        return res;
    }

    /**
     * Verifies an account by signing a message.
     * @param {*} web3
     * @param {*} address - The address to verify
     * @param {*} message  - Optional message to sign.
     * @returns
     */
    async function verify(
        // eslint-disable-next-line no-shadow
        address,
        message = 'Please verify your Identity by signing this message.'
    ) {
        if (!web3)
            throw new Error('Web 3 not yet loaded, please connect an account');
        const sig = await sign(message, address);
        const recoveredAddress = await recover(message, sig);

        return recoveredAddress.toLowerCase() === address.toLowerCase();
    }

    const value = useMemo(
        () => ({
            activateInjected,
            sign,
            recover,
            verify,
            active,
            account,
            error,
            ...rest,
        }),
        [active, account, error]
    );
    return (
        <web3Context.Provider value={value}>{children}</web3Context.Provider>
    );
};
export const Web3Provider = ({ children, ...rest }) => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Web3UtilProvider {...rest}>{children}</Web3UtilProvider>
        </Web3ReactProvider>
    );
};
