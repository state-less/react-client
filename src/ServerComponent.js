import React, { useCallback, useContext, useMemo } from 'react';
import baseLogger from './logger';
import { useComponent } from './hooks';
const logger = baseLogger.scope('ServerComponent');

export const context = React.createContext();
export const internalContext = React.createContext();


export const useAction = (name, handler, callback) => {
    const ctx = useContext(internalContext);
    const { children = [] } = ctx;

    const action = children.find((child) => {
        return child.component === 'Action' && child.props.name === name;
    });

    logger.debug`Using action ${name} ${handler} ${JSON.stringify(children)}`;
    if (!action)
        return () => { throw new Error('Handler not available') }

    if (action && action?.props?.fns &&  action?.props?.fns[handler]) {
        return action.props.fns[handler];
    }

    return action.handler;
}

export const useProps = () => {
    return useContext(context);
}

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <h1>Something went wrong.</h1>;
        }

        return this.props.children;
    }
}


export const ChildComponent = (props) => {
    const ctx = useContext(internalContext);
    const { children = [] } = ctx;
    const { index } = props;

    const serverChildren = children.filter((child) => {
        return child.component === "ClientComponent"
    });
    const serverProps = serverChildren[index];

    console.log("CHILD COMPONENT", serverChildren, serverProps, children, ctx);
    return props.children;
    const mappedProps = Object.entries(serverProps).reduce((obj, [key, state]) => {
        state[Symbol.for('l0g.format')] = () => state.value;
        logger.debug`Mapping component props ${key} ${state}`
        if (resolved[state.key]) {

            // logger.error('HAS RESOLVED', obj, key);

            return Object.assign(obj, {
                [key]: resolved[state.key]
            })
        }

        /** Map a live state to a property */
        if (state.id && state.key && state.scope)
            return Object.assign(obj, {
                [key]: state.value
            })
        return Object.assign(obj, { [key]: state });
    }, {})

    mappedProps.error = error;

    return <internalContext.Provider value={serverProps}>
        <context.Provider value={mappedProps}>
            {JSON.stringify(serverProps)}
            {/* {JSON.stringify(resolved)} */}
            {props.children}
        </context.Provider>
    </internalContext.Provider>
}
export const ServerComponent = (props) => {
    const { name, scope, children, index = 0, ...clientProps } = props;
    const parentCtx = useContext(internalContext);

    let rendered
    if (parentCtx) {
        const parentChildren = parentCtx?.children?.filter(c => c.component === 'ClientComponent')
        const child = parentChildren[index];
        rendered = child;
    }
    const component = useComponent(name, { scope, props: clientProps }, rendered);
    const { props: serverProps = {}, resolved, error } = component;
    const { children: serverChildren = [], ...rest } = serverProps;

    logger.debug`ServerComponent client props ${clientProps}`

    const mappedProps = Object.entries(rest).reduce((obj, [key, state]) => {
        state[Symbol.for('l0g.format')] = () => state.value;
        logger.debug`Mapping component props ${key} ${state} ${JSON.stringify(resolved)}`
        if (resolved[key]) {
            return Object.assign(obj, {
                [key]: resolved[key]
            })
        }
        /** Map a live state to a property */
        if (state.id && state.key && state.scope)
            return Object.assign(obj, {
                [key]: state.value
            })
        return Object.assign(obj, { [key]: state });
    }, {})

    mappedProps.error = error;
    return <internalContext.Provider value={serverProps}>
        <context.Provider value={mappedProps}>
            client props {JSON.stringify(clientProps)}
            {children}
        </context.Provider>
    </internalContext.Provider>
}

export const Slot = () => {

}

export const Action = (props, name) => {
    const { ctx } = useContext(internalContext);

    return <>
        {props.children}
    </>
}

