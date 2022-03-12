import { AuthStrategyFactory } from './lib/types';
export declare const web3Strategy: AuthStrategyFactory;
export declare const webAuthnStrategy: () => {
    authenticate: (challenge: any) => Promise<{
        challenge: any;
        response: any;
        success: boolean;
        strategy: string;
        type: any;
    }>;
    logout: () => any;
    strategy: string;
};
export declare const fingerprintStrategy: () => {
    authenticate: (challenge: any) => Promise<{
        challenge: any;
        response: import("@fingerprintjs/fingerprintjs").GetResult;
        success: boolean;
        strategy: string;
        type: any;
    }>;
    logout: () => any;
    strategy: string;
};
