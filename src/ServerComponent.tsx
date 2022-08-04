import React, { useContext, useMemo } from 'react';

import { useComponent } from './hooks';
import { orgLogger } from './lib/logger';

// TODO: Fix types in useComponent

type InternalContextProps = {
    children?: any[];
};
const context = React.createContext({});
const internalContext: React.Context<InternalContextProps> =
    React.createContext({});

/**
 * @description: A bound action handler that's directly mapped to a function on the serverside.
 * Look at the documentation of the serverside component to see the arguments it expects.
 * You can also import the type definitions from the serverside component if you're using typescript.
 */
interface Action<ActionArgs> {
    (args: ActionArgs): Promise<any>;
}

export const useAction = <ActionArgs,>(
    name,
    handler
): Action<ActionArgs> | null => {
    const ctx = useContext(internalContext);
    const { children = [] } = ctx;

    const action = children.find((child) => {
        return child.component === 'Action' && child.props.name === name;
    });

    if (!action) {
        orgLogger.scope('useAction')
            .warning`Handler '${name}' not available. Are you sure your component is rendering this action on the server?`;
        return null;
    }

    if (action && action?.props?.fns && action?.props?.fns[handler]) {
        if (action.props.disabled) {
            action.props.fns[handler].disabled = true;
        }
        return action.props.fns[handler];
    }

    if (action.props.disabled) {
        action.handler.disabled = true;
    }

    return action.handler;
};

export const useProps = () => {
    return useContext(context);
};

// const ChildComponent = (props) => {
//   const ctx = useContext(internalContext)
//   const { children = [] } = ctx
//   const { index } = props

//   const serverChildren = children.filter((child) => {
//     return child.component === 'ClientComponent'
//   })
//   const serverProps = serverChildren[index]

//   console.log('CHILD COMPONENT', serverChildren, serverProps, children, ctx)
//   return props.children
//   const mappedProps = Object.entries(serverProps).reduce(
//     (obj, [key, state]) => {
//       if (state) state[Symbol.for('l0g.format')] = () => state.value
//       if (resolved[state.key]) {
//         // logger.error('HAS RESOLVED', obj, key);

//         return Object.assign(obj, {
//           [key]: resolved[state.key]
//         })
//       }

//       /** Map a live state to a property */
//       if (state.id && state.key && state.scope)
//         return Object.assign(obj, {
//           [key]: state.value
//         })
//       return Object.assign(obj, { [key]: state })
//     },
//     {}
//   )

//   mappedProps.error = error

//   return (
//     <internalContext.Provider value={serverProps}>
//       <context.Provider value={mappedProps}>{props.children}</context.Provider>
//     </internalContext.Provider>
//   )
// }

export const ServerComponent = (props) => {
    const { name, scope, children, host, index = 0, ...clientProps } = props;
    const parentCtx = useContext(internalContext);

    let rendered;
    if (parentCtx) {
        const parentChildren = [parentCtx.children]
            .flat(2)
            .filter((c) => c?.component === 'ClientComponent');

        const child =
            parentChildren.find(({ key }) => key === name) ||
            parentChildren[index];
        rendered = child;
    }
    const component = useComponent(
        name,
        { scope, props: clientProps, host },
        rendered
    );
    const { props: serverProps = {}, resolved, error, loading } = component;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children: _serverChildren, ...rest } = serverProps;

    const mappedProps: any = Object.entries(rest).reduce(
        (obj, [key, state]: [string, any]) => {
            if (typeof resolved[key] !== 'undefined') {
                return Object.assign(obj, {
                    [key]: resolved[key],
                });
            }
            /** Map a live state to a property */
            if (state && state.id && state.key && state.scope)
                return Object.assign(obj, {
                    [key]: state.value,
                });
            return Object.assign(obj, { [key]: state });
        },
        {}
    );

    Object.assign(mappedProps, { error, loading });

    const serverPropsMemo = useMemo(() => {
        return { ...serverProps, name };
    }, [name, JSON.stringify(serverProps)]);

    return (
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        <internalContext.Provider value={serverPropsMemo}>
            <context.Provider value={mappedProps}>{children}</context.Provider>
        </internalContext.Provider>
    );
};
ServerComponent.childMap = {};
