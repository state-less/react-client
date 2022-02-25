import { FunctionComponent } from 'react';
declare type FingerPrintButtonProps = {
    t: Function | null;
};
/**
 * A button that attempts fingerprint based authentication against a react-server.
 * @param t - Optional translation function from react-i18n.
 * @returns
 */
export declare const FingerprintButton: FunctionComponent<FingerPrintButtonProps>;
export {};
