import { Strategy } from './types';
export declare const googleStrategy: Strategy;
export declare const web3Strategy: Strategy;
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
