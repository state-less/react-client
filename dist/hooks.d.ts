export declare const useStream: (name: any, def: any, host: string) => any;
export declare const useServerState: (clientDefaultValue: any, options: any) => any[];
export declare const useResponse: (fn: any, action: any, { keepAlive, host }: {
    keepAlive?: boolean;
    host?: any;
}) => (...args: any[]) => void;
/**
 * @param {boolean} strict - Throws errors in strict mode
 * @param {boolean} suspend - Throws a promise while loading
 * @param {string} scope - The scope of the components store
 * @param {props} scope - The clientside props passed to the backend component.
 */
declare type UseComponentOptions = {
    strict?: boolean;
    suspend?: boolean;
    scope: string;
    props: Record<string, any>;
    host?: string;
};
/**
 * useComponent - Hook that renders serverside components
 * @param {*} componentKey - The key of the serverside component
 * @param {*} options - Options

 */
export declare const useComponent: (componentKey: string, { strict, suspend, scope, props: clientProps, host, ...rest }: UseComponentOptions, rendered: Record<string, any>) => any;
export {};
