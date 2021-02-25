import React, { useContext, useMemo } from 'react';
import baseLogger from './logger';
import { useComponent } from './hooks';
import logger from './logger';

export const context = React.createContext();
export const internalContext = React.createContext();


export const useAction = (name, handler) => {
    const ctx = useContext(internalContext);
    const {children = []} = ctx;
    const action = children.find((child) => {
        return child.component === 'Action' && child.props.name === name;
    });
    
    logger.debug`Using action ${name} ${handler} ${JSON.stringify(children)}`;
    if (!action) 
    return () => {throw new Error('Handler not available')}
    if (action && action.props.fns[handler]) {

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

export const ServerComponent = (props) => {
    const {name, scope} = props;
    const component =  useComponent(name, {scope});
    const {props: serverProps = {}, resolved, error} = component;
    const {children = [], ...rest} = serverProps;
    
    const logger = useMemo(() => baseLogger.scope('ServerComponent'));

    const mappedProps = Object.entries(rest).reduce((obj, [key, state]) => {
        state[Symbol.for('l0g.format')] = () => state.value;
        logger.debug`Mapping component props ${key} ${state}`
        if (resolved[state.key])  {

            // logger.error('HAS RESOLVED', obj, key);

            return Object.assign(obj, {
                [key]: resolved[state.key]
            })
        }
        if (state.id && state.key && state.scope)
            return Object.assign(obj, {
                [key]: state.value
            })
        return Object.assign(obj, {[key]: state});
    }, {})
    mappedProps.error = error;
    return <internalContext.Provider value={serverProps}>
        <context.Provider value={mappedProps}>
            {/* {JSON.stringify(mappedProps)} */}
            {/* {JSON.stringify(resolved)} */}
            {props.children}
        </context.Provider>
    </internalContext.Provider>
}

export const Slot = () => {

}

export const Action = (props, name) => {
    const {ctx} = useContext(internalContext);
    
    return <>
        {props.children}
    </>
}

