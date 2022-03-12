import { PropsWithChildren } from 'react';

export type AuthResult = {
    challenge?: object;
    response?: any;
    success: boolean;
    strategy: string;
};

export type AuthStrategy = {
    authenticate: (challenge: object) => Promise<AuthResult>;
    id: string;
    logout: () => void;
    strategy: string;
};

export interface AuthStrategyFactory<T = AuthStrategy> {
    (): T;
}

export type ChallengeResponse = {
    challenge: unknown;
    response: unknown;
    strategy: string;
    success: boolean;
};

export type StrategyInstance = {
    authenticate: (
        challenge: unknown,
        token: Record<string, any>
    ) => Promise<ChallengeResponse>;
};

export type Strategy = {
    (props?: PropsWithChildren<any>): StrategyInstance;
};
