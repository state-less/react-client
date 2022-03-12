import { PropsWithChildren } from 'react';
export declare type AuthResult = {
    challenge?: object;
    response?: any;
    success: boolean;
    strategy: string;
};
export declare type AuthStrategy = {
    authenticate: (challenge: object) => Promise<AuthResult>;
    id: string;
    logout: () => void;
    strategy: string;
};
export interface AuthStrategyFactory<T = AuthStrategy> {
    (): T;
}
export declare type ChallengeResponse = {
    challenge: unknown;
    response: unknown;
    strategy: string;
    success: boolean;
};
export declare type StrategyInstance = {
    authenticate: (challenge: unknown, token: Record<string, any>) => Promise<ChallengeResponse>;
};
export declare type Strategy = {
    (props?: PropsWithChildren<any>): StrategyInstance;
};
