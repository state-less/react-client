import { useEffect, useRef } from "react";
import logger from './logger'

const hookLogger = logger.scope('useTraceUpdate');
export function useTraceUpdate(props, name) {
    const prev = useRef(props);
    useEffect(() => {
      const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
        if (prev.current[k] !== v) {
          ps[k] = [prev.current[k], v];
        }
        return ps;
      }, {});
      if (Object.keys(changedProps).length > 0) {
        hookLogger.debug`Propery ${name} changed. New props are ${JSON.stringify(props)}`
      } else {
        hookLogger.debug`Propery ${name} didn't change. New props are ${props}`

      }
      prev.current = props;
    });
  }