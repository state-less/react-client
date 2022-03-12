import { useContext, useEffect } from 'react';

import {
    solveRegistrationChallenge,
    solveLoginChallenge,
} from '@webauthn/client';

import fp from '@fingerprintjs/fingerprintjs';

import { web3Context } from './Web3';
import { AuthResult, AuthStrategyFactory } from './lib/types';
import { noopSync } from './lib/util';

export const web3Strategy: AuthStrategyFactory = () => {
    const { account, activateInjected, sign, deactivate } =
        useContext(web3Context);

    const connect = async () => {
        await activateInjected();
    };

    useEffect(() => {
        (async () => {
            await connect();
        })();
    }, []);

    const authenticate = async (challenge): Promise<AuthResult> => {
        if (account && challenge.type === 'sign') {
            const response = await sign(challenge.challenge, account);
            return { challenge, response, success: true, strategy: 'web3' };
        }
        await activateInjected();
        return { success: false, strategy: 'web3' };
    };

    return { authenticate, id: account, logout: deactivate, strategy: 'web3' };
};

export const webAuthnStrategy = () => {
    const authenticate = async (challenge) => {
        let response;
        if (challenge.type === 'register') {
            response = await solveRegistrationChallenge(challenge.challenge);
        } else if (challenge.type === 'login') {
            response = await solveLoginChallenge(challenge.challenge);
        }

        return {
            challenge,
            response,
            success: true,
            strategy: 'webauthn',
            type: challenge.type,
        };
    };

    return { authenticate, logout: noopSync, strategy: 'webauthn' };
};

export const fingerprintStrategy = () => {
    const authenticate = async (challenge) => {
        const fp2 = await fp.load();
        const response = await fp2.get();
        return {
            challenge,
            response,
            success: true,
            strategy: 'fingerprint',
            type: challenge.type,
        };
    };

    return { authenticate, logout: noopSync, strategy: 'fingerprint' };
};
