import { useContext, useEffect } from 'react';

import {
    solveRegistrationChallenge,
    solveLoginChallenge,
} from '@webauthn/client';
import { web3Context } from './Web3';
import fp from '@fingerprintjs/fingerprintjs';
import { AuthResult, AuthStrategyFactory } from './lib/types';

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
        } else {
            await activateInjected();
            return { success: false, strategy: 'web3' };
        }
    };

    return { authenticate, id: account, logout: deactivate, strategy: 'web3' };
};

export const webAuthnStrategy = () => {
    const authenticate = async (challenge) => {
        console.log('WebAauthn auth challenge', challenge);
        let response;
        if (challenge.type === 'register') {
            response = await solveRegistrationChallenge(challenge.challenge);
        } else if (challenge.type === 'login') {
            response = await solveLoginChallenge(challenge.challenge);
        }
        console.log('WebAauthn auth response', response);
        return {
            challenge,
            response,
            success: true,
            strategy: 'webauthn',
            type: challenge.type,
        };
    };

    return { authenticate, logout: () => {}, strategy: 'webauthn' };
};

export const fingerprintStrategy = () => {
    const authenticate = async (challenge) => {
        console.log('Fingerprint auth challenge', challenge);
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

    return { authenticate, logout: () => {}, strategy: 'fingerprint' };
};
