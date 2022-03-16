import { useContext, useEffect } from 'react';

import {
    solveRegistrationChallenge,
    solveLoginChallenge,
} from '@webauthn/client';

import fp from '@fingerprintjs/fingerprintjs';

import { web3Context } from './Web3';

import { noopSync } from './lib/util';
import { ChallengeResponse, Strategy } from './types';

export const googleStrategy: Strategy = () => {
    return {
        authenticate: async (challenge, token) => {
            return {
                challenge,
                response: token.tokenId,
                strategy: 'google',
                success: true,
            };
        },
        logout: noopSync,
        id: 'google',
        strategy: 'google',
    };
};

export const web3Strategy: Strategy = ({ autoConnect = false } = {}) => {
    const { account, activateInjected, sign, deactivate } =
        useContext(web3Context);

    const connect = async () => {
        await activateInjected();
    };

    useEffect(() => {
        (async () => {
            if (autoConnect) await connect();
        })();
    }, []);

    const authenticate = async (challenge): Promise<ChallengeResponse> => {
        if (account && challenge.type === 'sign') {
            const response = await sign(challenge.challenge, account);
            return { challenge, response, success: true, strategy: 'web3' };
        }
        await activateInjected();
        return { challenge, response: null, success: false, strategy: 'web3' };
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
