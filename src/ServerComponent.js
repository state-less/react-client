import React, { useCallback, useContext, useMemo, useRef } from 'react';
import baseLogger from './logger';
import { useComponent } from './hooks';
const logger = baseLogger.scope('ServerComponent');

export const context = React.createContext();
export const internalContext = React.createContext();


export const useAction = (name, handler, callback) => {
    const ctx = useContext(internalContext);
    window.ctx = ctx;
    const { children = [] } = ctx;

    const action = children.find((child) => {
        return child.component === 'Action' && child.props.name === name;
    });

    if (!action)
        return () => { console.warn('Handler not available') }

    if (action && action?.props?.fns && action?.props?.fns[handler]) {
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
        if (state)
        state[Symbol.for('l0g.format')] = () => state.value;
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
            {props.children}
        </context.Provider>
    </internalContext.Provider>
}

export const useProps2 = () => {
    const { props } = useContext(internalContext);
    return props
}
export const ServerComponent2Child = (props) => {
    const { name, children, index, ...clientProps} = props;
    const {children: serverChildren} = useContext(internalContext);


    return <internalContext.Provider value={{ props: {foo:'bar'} }}>
        {JSON.stringify(serverChildren)}
    </internalContext.Provider>
}
export const ServerComponent2 = (props) => {
    const { name, children, ...clientProps } = props;

    const { props: { children: serverChildren, ...serverProps } } = useComponent(name, { props: clientProps });
    const parent = useContext(internalContext);

    if (parent) {
        return <ServerComponent2Child {...props} />
    }
    return <internalContext.Provider value={{ children: serverChildren, props: serverProps }}>
        {children}
    </internalContext.Provider>
}


export const ServerComponent = (props) => {
    const { name, scope, children, index = 0, ...clientProps } = props;
    const parentCtx = useContext(internalContext);

    let rendered
    if (parentCtx) {
        const parentChildren = [parentCtx.children].flat(2).filter(c => c.component === 'ClientComponent')
        console.log("PARENT CHILDREN", parentChildren, [parentCtx.children].flat(2));
        const child = parentChildren.find(child => child.key === name) || parentChildren[index];
        rendered = child;
    }
    const component = useComponent(name, { scope, props: clientProps }, rendered);
    const { props: serverProps = {}, resolved, error } = component;
    const { children: serverChildren = [], ...rest } = serverProps;

    const mappedProps = Object.entries(rest).reduce((obj, [key, state]) => {
        if (state != null && typeof state !== 'string') {
            state[Symbol.for('l0g.format')] = () => state.value;
        }
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
    return <internalContext.Provider value={{ ...serverProps, name }}>
        <context.Provider value={mappedProps}>
            {children}
        </context.Provider>
    </internalContext.Provider>
}
ServerComponent.childMap = {};
export const Slot = () => {

}

export const Action = (props, name) => {
    const { ctx } = useContext(internalContext);

    return <>
        {props.children}
    </>
}

