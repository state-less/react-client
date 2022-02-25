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
