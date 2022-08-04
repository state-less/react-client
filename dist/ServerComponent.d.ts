/// <reference types="react" />
/**
 * @description: A bound action handler that's directly mapped to a function on the serverside.
 * Look at the documentation of the serverside component to see the arguments it expects.
 * You can also import the type definitions from the serverside component if you're using typescript.
 */
interface Action<ActionArgs> {
    (args: ActionArgs): Promise<any>;
}
export declare const useAction: <ActionArgs>(name: any, handler: any) => Action<ActionArgs>;
export declare const useProps: () => {};
export declare const ServerComponent: {
    (props: any): JSX.Element;
    childMap: {};
};
export {};
