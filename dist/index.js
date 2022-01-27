function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var jotai = require('jotai');
var l0g = _interopDefault(require('l0g'));
var uuid = require('uuid');
var core = require('@web3-react/core');
var providers = require('@ethersproject/providers');
var injectedConnector = require('@web3-react/injected-connector');
var Web3 = _interopDefault(require('web3'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _taggedTemplateLiteralLoose(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }

  strings.raw = raw;
  return strings;
}

// A type of promise-like that resolves synchronously and supports only one observer

const _iteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))) : "@@iterator";

const _asyncIteratorSymbol = /*#__PURE__*/ typeof Symbol !== "undefined" ? (Symbol.asyncIterator || (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))) : "@@asyncIterator";

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
	try {
		var result = body();
	} catch(e) {
		return recover(e);
	}
	if (result && result.then) {
		return result.then(void 0, recover);
	}
	return result;
}

var SCOPE_CLIENT = '$client';
var EVENT_DELIM = ':';
var EVENT_SET_STATE = 'setState';
var EVENT_USE_STATE = 'useState';
var EVENT_CREATE_STATE = 'createState';
var EVENT_ERROR = 'error';
var EVENT_USE_COMPONENT = 'render';
var DEFAULT_SCOPE = SCOPE_CLIENT;

var context = React.createContext();

var Logger = l0g.Logger,
    Color = l0g.formatters.Color,
    ChromeTransport = l0g.transports.ChromeTransport;
Color.colors.type.string = 'green';
Color.colors.type.object = 'green';
Color.colors.key.level.warning = 'red';
Color.colors.key.level.info = 'blue';
var formatter = new Color(function (options) {
  var ts = options.ts,
      level = options.level,
      scope = options.scope,
      message = options.message;
  return ts + " " + scope + " " + level + ": " + message;
});
Color.formatMap.get(Color.isArray).unshift(function (v) {
  return v && "Array[" + v.length + "]";
});
Color.formatMap.get(Color.isObject).unshift(function (v) {
  return v && v.constructor.name + "[" + Object.keys(v) + "]";
});
var transports = [new ChromeTransport({
  formatter: formatter
})];
var orgLogger = new Logger('debug', {
  transports: transports
}).scope('state-less');
var packageLogger = orgLogger.scope('react-client');
var windowLogger = orgLogger.scope('browser-console');

if (typeof window !== 'undefined') {
  window.Logger = Logger;
  window.logger = windowLogger;
}

var hookLogger = packageLogger.scope('useTraceUpdate');

var _templateObject;
var parseSocketResponse = function parseSocketResponse(data) {
  var body = data.body,
      statusCode = data.statusCode,
      message = data.message;

  if (statusCode !== 200 && statusCode !== 500) {
    throw new Error(message || 'Internal Server Error');
  }

  try {
    var parsed = JSON.parse(body);
    return parsed;
  } catch (e) {
    var _message = packageLogger.warning(_templateObject || (_templateObject = _taggedTemplateLiteralLoose(["Error parsing render result ", ""])), e);

    throw new Error(_message);
  }
};
var emit = function emit(socket, data) {
  if (Array.isArray(socket)) {
    socket.forEach(function (socket) {
      socket.send(JSON.stringify(data));
    });
  } else {
    socket.send(JSON.stringify(data));
  }
};
var request = function request(socket, data) {
  try {
    var id = uuid.v4();
    emit(socket, _extends({
      type: request
    }, data, {
      id: id
    }));
    return Promise.resolve(new Promise(function (resolve, reject) {
      var onResponse = function onResponse(event) {
        try {
          return Promise.resolve(consume(event)).then(function (data) {
            var json = parseSocketResponse(data);

            if (data.id === id) {
              if (data.type === 'error') {
                reject(json);
              } else {
                resolve(json);
              }

              off(socket, 'message', onResponse);
            }
          });
        } catch (e) {
          return Promise.reject(e);
        }
      };

      on(socket, 'message', onResponse);
    }));
  } catch (e) {
    return Promise.reject(e);
  }
};
var on = function on(socket, event, fn) {
  if (Array.isArray(socket)) {
    socket.forEach(function (socket) {
      socket.addEventListener(event, fn);
    });
  } else {
    socket.addEventListener(event, fn);
  }
};
var off = function off(socket, event, fn) {
  if (Array.isArray(socket)) {
    socket.forEach(function (socket) {
      socket.removeEventListener(event, fn);
    });
  } else {
    socket.removeEventListener(event, fn);
  }
};
var onMessage = function onMessage(socket, fn) {
  return on(socket, 'message', fn);
};
var consume = function consume(event) {
  try {
    try {
      return Promise.resolve(JSON.parse(event.data));
    } catch (e) {
      if (typeof event.data === 'string') return Promise.resolve(event.data);
      throw e;
    }
  } catch (e) {
    return Promise.reject(e);
  }
};

var _excluded = ["key", "strict", "defaultValue", "defer", "value", "scope", "suspend", "rendered", "requestType"],
    _excluded2 = ["strict", "suspend", "scope", "props"],
    _excluded3 = ["error"];
var stateCount = 0;

var increaseCount = function increaseCount() {
  return stateCount++;
};

var join = function join(delim) {
  return function () {
    for (var _len = arguments.length, strings = new Array(_len), _key = 0; _key < _len; _key++) {
      strings[_key] = arguments[_key];
    }

    return strings.join(delim);
  };
};

var genEventName = join(EVENT_DELIM);

var genIdEventName = function genIdEventName(event) {
  return function (id) {
    return genEventName(event, id);
  };
};

var genSetStateEventName = genIdEventName(EVENT_SET_STATE);
var genCreateStateEventName = genIdEventName(EVENT_CREATE_STATE);
var genErrorEventName = genIdEventName(EVENT_ERROR);

var alignArgs = function alignArgs(length) {
  for (var _len2 = arguments.length, def = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    def[_key2 - 1] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var nargs = [].concat(args);

    for (var i = length; i > def.length; i--) {
      if (!args[i - 1]) {
        nargs[i - 1] = args[i - 2];
        nargs[i - 2] = def[i - 2];
      }
    }

    return nargs;
  };
};

var alignUseServerStateArgs = alignArgs(2, null);
var atoms = new Map();

var useStream = function useStream(name, def) {
  var _useContext = React.useContext(context),
      socket = _useContext.socket,
      open = _useContext.open;

  var id = React.useMemo(function () {
    return uuid.v4();
  });

  var _useState2 = React.useState(def || null),
      data = _useState2[0],
      setData = _useState2[1];

  React.useEffect(function () {
    if (open) {
      emit(socket, {
        action: 'stream',
        name: name,
        id: id
      });
      on(socket, 'message', function (event) {
        try {
          return Promise.resolve(consume(event)).then(function (data) {
            var json = parseSocketResponse(data);

            if (data.id === id) {
              setData(json);
            }
          });
        } catch (e) {
          return Promise.reject(e);
        }
      });
    }
  }, [open]);
  return data;
};
var stateLoadingStates = {};
var useServerState = function useServerState(clientDefaultValue, options) {
  var _alignUseServerStateA = alignUseServerStateArgs(clientDefaultValue, options),
      clientDefaultValue = _alignUseServerStateA[0],
      options = _alignUseServerStateA[1];

  var _options = options,
      key = _options.key,
      _options$strict = _options.strict,
      strict = _options$strict === void 0 ? false : _options$strict,
      defaultValue = _options.defaultValue,
      _options$defer = _options.defer,
      defer = _options$defer === void 0 ? false : _options$defer,
      _options$value = _options.value,
      value = _options$value === void 0 ? defaultValue : _options$value,
      _options$scope = _options.scope,
      scope = _options$scope === void 0 ? DEFAULT_SCOPE : _options$scope,
      _options$suspend = _options.suspend,
      suspend = _options$suspend === void 0 ? false : _options$suspend,
      _options$requestType = _options.requestType,
      requestType = _options$requestType === void 0 ? 'request' : _options$requestType,
      rest = _objectWithoutPropertiesLoose(_options, _excluded);

  var ctx = React.useContext(context);

  try {
    var socket = ctx.socket,
        open = ctx.open,
        payload = ctx.payload;
    var debugProps = React.useMemo(function () {
      return {
        clientDefaultValue: clientDefaultValue,
        options: options
      };
    });
    var defaultState = React.useMemo(function () {
      return {
        value: clientDefaultValue,
        id: rest.id || null,
        scope: scope,
        key: key
      };
    });
    var atm;

    if (!atoms.has(scope + ":" + key)) {
      atm = jotai.atom({
        defaultState: defaultState,
        clientId: increaseCount()
      });
      stateLoadingStates[scope + ":" + key] = false;
      atoms.set(scope + ":" + key, atm);
    } else {
      atm = atoms.get(scope + ":" + key);
    }

    var removeAllListeners = React.useMemo(function () {
      return false && socket.removeAllListeners.bind(socket);
    }, [socket]);

    var _useAtom = jotai.useAtom(atm),
        _state = _useAtom[0],
        setState = _useAtom[1];

    React.useEffect(function () {
      if (rest.id) {
        setState(_extends({}, _state, {
          id: rest.id
        }));
      }
    }, [rest.id]);
    var clientId = _state.clientId;

    var setLoading = function setLoading(loading) {
      stateLoadingStates[scope + ":" + key] = loading;
    };

    var extendState = function extendState(data) {
      return setState(_extends({}, _state, data));
    };

    var id = _state.id,
        error = _state.error;
    var setStateEvent = React.useMemo(function () {
      return genSetStateEventName(id);
    }, [id]);
    var createStateEvent = React.useMemo(function () {
      return genCreateStateEventName(clientId);
    }, [clientId]);
    var errorEvent = React.useMemo(function () {
      return genErrorEventName(clientId);
    }, [clientId]);

    var onTimeout = function onTimeout() {
      setState(function (state) {
        var id = state.id;

        if (!id) {
          return _extends({}, state, {
            error: new Error('Cancelling state due to timeout')
          });
        }

        return state;
      });
      setLoading(false);
    };

    React.useEffect(function () {
      var to;

      if (open && !id && !error && !defer && !stateLoadingStates[scope + ":" + key]) {
        stateLoadingStates[scope + ":" + key] = true;

        var onSetValue = function onSetValue(event) {
          try {
            return Promise.resolve(consume(event)).then(function (eventData) {
              var data = parseSocketResponse(eventData);

              if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id) && typeof data.value === 'undefined') {
                return _state;
              }

              if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id)) {
                setState(function (state) {
                  return _extends({}, state, data);
                });
              }
            });
          } catch (e) {
            return Promise.reject(e);
          }
        };

        onMessage(socket, onSetValue);
        emit(socket, {
          action: EVENT_USE_STATE,
          key: key,
          value: value,
          scope: scope,
          requestId: clientId,
          options: _extends({}, rest),
          requestType: requestType
        });
      }

      clearTimeout(stateLoadingStates[scope + ":" + key]);
      return function () {
        off(socket, 'message', onSetValue);
      };
    }, [open, defer]);
    React.useEffect(function () {
      if (id) {
        if (!defer && id) {
          var onSetValue = function onSetValue() {
            try {
              return Promise.resolve(consume(event)).then(function (eventData) {
                var data = parseSocketResponse(eventData);

                if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id) && typeof data.value === 'undefined') {
                  return _state;
                }

                if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id)) {
                  setState(function (state) {
                    delete state.error;
                    return _extends({}, state, data);
                  });
                }
              });
            } catch (e) {
              return Promise.reject(e);
            }
          };

          on(socket, 'message', onSetValue);

          var onError = function onError(event) {
            try {
              return Promise.resolve(consume(event)).then(function (data) {
                var _temp = function () {
                  if (data.type === 'error' && id === data.id) {
                    return Promise.resolve(parseSocketResponse(data)).then(function (err) {
                      extendState({
                        error: new Error(err.message)
                      });
                    });
                  }
                }();

                if (_temp && _temp.then) return _temp.then(function () {});
              });
            } catch (e) {
              return Promise.reject(e);
            }
          };

          on(socket, 'message', onError);
        }
      }

      return function () {
        if (id) {
          off(socket, 'message', onSetValue);
          off(socket, 'message', onError);
        }
      };
    });
    React.useEffect(function () {
      if (strict && error) {
        throw error;
      }
    }, [error]);
    React.useEffect(function () {
      setLoading(false);
    }, [id, error, key]);

    var setServerState = function setServerState(value) {
      socket.emit(EVENT_SET_STATE, {
        id: id,
        key: key,
        value: value
      }, {
        scope: scope
      });
    };

    console.log("USE SERVER STATE", key, _state.error);

    if (_state.error) {
      if (strict) {
        throw new Error(_state.error);
      }

      return [_state.error, _state.value];
    }

    if (suspend && !_state.value && loading && !id) {
      throw new Promise(Function.prototype);
    }

    if (!key && options.defer) {
      return [clientDefaultValue || null];
    }

    return [_state.value || clientDefaultValue, setServerState];
  } catch (e) {
    if (!ctx) throw new Error('No available context. Are you missing a Provider?');
    throw e;
  }
};
var useResponse = function useResponse(fn, action, keepAlive) {
  var ctx = React.useContext(context);
  var socket = ctx.socket;

  var _useState3 = React.useState(null),
      id = _useState3[0],
      setId = _useState3[1];

  React.useEffect(function () {
    if (!id) return;
    onMessage(socket, function (event) {
      try {
        return Promise.resolve(consume(event)).then(function (eventData) {
          var data = parseSocketResponse(eventData);

          if (eventData.id === id) {
            fn(data);
          }
        });
      } catch (e) {
        return Promise.reject(e);
      }
    });
  }, [id]);
  return function () {
    var id = action.apply(void 0, arguments);
    setId(id);
  };
};
var componentAtoms = new Map();
var loadingStates = {};
var useComponent = function useComponent(componentKey, options, rendered) {
  if (options === void 0) {
    options = {};
  }

  var _options2 = options,
      _options2$strict = _options2.strict,
      strict = _options2$strict === void 0 ? false : _options2$strict,
      _options2$scope = _options2.scope,
      scope = _options2$scope === void 0 ? DEFAULT_SCOPE : _options2$scope,
      clientProps = _options2.props,
      rest = _objectWithoutPropertiesLoose(_options2, _excluded2);

  var ctx = React.useContext(context);
  var logAtom = React.useMemo(function () {
    return jotai.atom();
  }, [componentKey]);

  try {
    var _ref, _ref3, _ref3$props, _ref3$props$children;

    var socket = ctx.socket,
        sockets = ctx.sockets,
        open = ctx.open,
        secOpen = ctx.secOpen,
        allOpen = ctx.allOpen,
        headers = ctx.headers;
    var debugProps = React.useMemo(function () {
      return {
        key: componentKey,
        options: options
      };
    });
    var defaultState = React.useMemo(function () {
      return {
        component: rendered,
        props: {},
        scope: scope,
        key: componentKey
      };
    });
    var atm;

    if (!componentAtoms.has(scope + ":" + componentKey)) {
      atm = jotai.atom({
        defaultState: defaultState
      });
      loadingStates[scope + ":" + componentKey] = false;
      componentAtoms.set(scope + ":" + componentKey, atm);
    } else {
      atm = componentAtoms.get(scope + ":" + componentKey);
    }

    var removeAllListeners = React.useMemo(function () {
      return false && socket.removeAllListeners.bind(socket);
    }, [socket]);

    var _useAtom2 = jotai.useAtom(atm),
        internalState = _useAtom2[0],
        setState = _useAtom2[1];

    var extendState = function extendState(data) {
      return setState(_extends({}, internalState, data));
    };

    var setLoading = function setLoading(loading) {
      return extendState({
        loading: loading
      });
    };

    var component = internalState.component,
        _loading = internalState.loading;

    var _useServerState = useServerState(component, {
      key: componentKey,
      scope: 'public',
      defer: !component && !rendered,
      requestType: 'subscribe',
      rendered: rendered
    }),
        componentState = _useServerState[0];

    var resolved = {};
    var keys = Object.keys(((_ref = componentState || rendered) === null || _ref === void 0 ? void 0 : _ref.props) || {});
    keys.length = 15;

    for (var _i = 0, _keys = keys; _i < _keys.length; _i++) {
      var _ref2;

      var propKey = _keys[_i];
      var serverProps = ((_ref2 = componentState || rendered) === null || _ref2 === void 0 ? void 0 : _ref2.props) || {};

      var _state2 = serverProps[propKey] || {};

      var resolvedState = useServerState(_state2.value, {
        key: _state2.key,
        scope: _state2.scope,
        id: _state2.id,
        defer: !_state2.id || !_state2.key || !_state2.scope
      });

      if (_state2.id && _state2.key && _state2.scope) {
        if (typeof resolvedState[0] !== 'undefined') {
          var value = resolvedState[0],
              setValue = resolvedState[1];
          var setKey = "set" + propKey[0].toUpperCase() + propKey.slice(1);
          resolved[propKey] = value;
          resolved[setKey] = setValue;
        }
      }
    }

    (_ref3 = componentState || rendered) === null || _ref3 === void 0 ? void 0 : (_ref3$props = _ref3.props) === null || _ref3$props === void 0 ? void 0 : (_ref3$props$children = _ref3$props.children) === null || _ref3$props$children === void 0 ? void 0 : _ref3$props$children.filter(function (child) {
      return child.component === 'Action';
    }).forEach(function (action) {
      action.props.fns = action.props.handler.reduce(function (fns, handler) {
        var _Object$assign;

        return Object.assign(fns, (_Object$assign = {}, _Object$assign[handler] = function () {
          for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          try {
            var id = uuid.v4();
            return Promise.resolve(_catch(function () {
              return Promise.resolve(request([socket].concat(sockets), {
                action: 'call',
                id: id,
                componentKey: componentKey,
                name: action.props.name,
                handler: handler,
                args: args,
                headers: headers
              }));
            }, function (err) {
              throw err;
              var errObj = new Error(err.message);
              Object.assign(errObj, err);
              console.log("Parsed Error", err, state, componentState, resolved);
              extendState({
                error: errObj
              });
            }));
          } catch (e) {
            return Promise.reject(e);
          }
        }, _Object$assign));
      }, {});
    });

    var _ref4 = component || {},
        props = _ref4.props,
        error = _ref4.error;

    var cs = React.useMemo(function () {
      return {
        rendered: rendered
      };
    });

    var onTimeout = function onTimeout() {
      loadingStates[scope + ":" + componentKey] = false;
    };

    React.useEffect(function () {
      var to;

      if (open && !props && !error && !_loading && !loadingStates[scope + ":" + componentKey]) {
        to = setTimeout(onTimeout, 15000);
        loadingStates[scope + ":" + componentKey] = true;
        onMessage(socket, function (event) {
          try {
            var _temp3 = _catch(function () {
              return Promise.resolve(consume(event)).then(function (eventData) {
                if (eventData.action === 'render' && eventData.key == componentKey) {
                  var data = parseSocketResponse(eventData);

                  var _error = internalState.error,
                      _rest = _objectWithoutPropertiesLoose(internalState, _excluded3);

                  setState(_extends({}, _rest, {
                    component: data
                  }));
                }
              });
            }, function () {});

            return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
          } catch (e) {
            return Promise.reject(e);
          }
        });
        onMessage(socket, function (event) {
          try {
            return Promise.resolve(consume(event)).then(function (data) {
              var _temp4 = function () {
                if (data.type === 'error' && data.key == componentKey) {
                  return Promise.resolve(parseSocketResponse(data)).then(function (err) {
                    var errObj = new Error(err.message);
                    Object.assign(errObj, err);
                    console.log("Parsed Error", err);
                    extendState({
                      error: errObj
                    });
                  });
                }
              }();

              if (_temp4 && _temp4.then) return _temp4.then(function () {});
            });
          } catch (e) {
            return Promise.reject(e);
          }
        });
        on(socket, 'log', function (data) {
          var _orgLogger$scope$setM;

          data.tag[0].raw = 'Fake Tagged Template String Arg';

          (_orgLogger$scope$setM = orgLogger.scope(data.scope).setMessageLevel(data.level)).log.apply(_orgLogger$scope$setM, data.tag);
        });
        console.log("Emit render");
        emit(socket, {
          action: EVENT_USE_COMPONENT,
          key: componentKey,
          scope: scope || 'base',
          props: clientProps,
          options: _extends({}, rest),
          headers: headers
        });
        setLoading(to);
      }

      secOpen.forEach(function (open, i) {
        if (open) {
          var _socket = sockets[i];
          console.log("Emit render 2");
          emit(_socket, {
            action: EVENT_USE_COMPONENT,
            key: componentKey,
            scope: scope || 'base',
            options: _extends({}, rest)
          });
        }
      });
      clearTimeout(_loading);

      (function () {
        [EVENT_ERROR].forEach(function (event) {
          return socket.removeAllListeners(event);
        });
      });
    }, [open]);
    React.useEffect(function () {
      if (strict && error) {
        throw new Error(error);
      }
    }, [error]);
    React.useEffect(function () {
      setLoading(false);
    }, [internalState.props, error]);

    if (internalState.error && !component && !rendered) {
      return internalState;
    }

    if (componentState instanceof Error) {
      throw componentState;
    }

    if (!component && _loading) {
      return defaultState;
      throw new Promise(Function.prototype);
    }

    return _extends({}, rendered || {}, componentState, internalState, {
      resolved: resolved
    });
  } catch (e) {
    if (!ctx) throw new Error('No available context. Are you missing a Provider?');
    throw e;
  }
};
var useServerAtom = function useServerAtom(atm, clientDefaultValue, options) {
  var _useContext2 = React.useContext(context),
      useAtom = _useContext2.useAtom;

  var _useServerState2 = useServerState(clientDefaultValue, options),
      state = _useServerState2[0];

  var _useAtom3 = useAtom(atm),
      value = _useAtom3[0],
      setAtomValue = _useAtom3[1];

  React.useEffect(function () {
    setAtomValue(state);
  }, [state]);
  return [value, setAtomValue];
};

var _excluded$1 = ["activate", "account", "active", "error"],
    _excluded2$1 = ["children"];
var injected = new injectedConnector.InjectedConnector({
  supportedChainIds: [56, 1337]
});

function getLibrary(provider, connector) {
  return new providers.Web3Provider(provider);
}

var web3Context = React.createContext();
var Web3UtilProvider = function Web3UtilProvider(_ref) {
  var verify = function verify(account, message) {
    if (message === void 0) {
      message = 'Please verify your Identity by signing this message.';
    }

    try {
      console.log("VERIFY ", account, message);
      if (!web3) throw new Error('Web 3 not yet loaded, please connect an account');
      return Promise.resolve(sign(message, account)).then(function (sig) {
        return Promise.resolve(recover(message, sig)).then(function (acc) {
          console.log("VERIFIED", account, acc, sig);
          return acc.toLowerCase() === account.toLowerCase();
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var recover = function recover(message, sig) {
    try {
      if (!web3) throw new Error('Web 3 not yet loaded, please connect an account');
      return Promise.resolve(web3.eth.personal.ecRecover(message, sig));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var sign = function sign(message, account) {
    try {
      if (!web3 && !account) throw new Error('Web 3 not yet loaded, please connect an account');
      var res;

      var _temp2 = function () {
        if (account) {
          var _web3React$library2;

          var _web = new Web3(web3React === null || web3React === void 0 ? void 0 : (_web3React$library2 = web3React.library) === null || _web3React$library2 === void 0 ? void 0 : _web3React$library2.provider);

          return Promise.resolve(_web.eth.personal.sign(message, account)).then(function (_web3$eth$personal$si) {
            res = _web3$eth$personal$si;
          });
        } else {
          return Promise.resolve(web3.eth.personal.sign(message, account)).then(function (_web3$eth$personal$si2) {
            res = _web3$eth$personal$si2;
          });
        }
      }();

      return Promise.resolve(_temp2 && _temp2.then ? _temp2.then(function () {
        return res;
      }) : res);
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var children = _ref.children,
      _ref$autoActivate = _ref.autoActivate,
      autoActivate = _ref$autoActivate === void 0 ? true : _ref$autoActivate;
  var web3React = core.useWeb3React();

  var activate = web3React.activate,
      account = web3React.account,
      active = web3React.active,
      error = web3React.error,
      rest = _objectWithoutPropertiesLoose(web3React, _excluded$1);

  var _useState = React.useState(null),
      web3 = _useState[0],
      setWeb3 = _useState[1];

  var activateInjected = function activateInjected() {
    try {
      return Promise.resolve(activate(injected));
    } catch (e) {
      return Promise.reject(e);
    }
  };

  React.useEffect(function () {
    if (!autoActivate) return;

    try {
      return Promise.resolve(activate(injected)).then(function () {});
    } catch (e) {
      Promise.reject(e);
    }
  }, []);
  React.useEffect(function () {
    if (account) {
      var _web3React$library;

      var _web3 = new Web3(web3React === null || web3React === void 0 ? void 0 : (_web3React$library = web3React.library) === null || _web3React$library === void 0 ? void 0 : _web3React$library.provider);

      setWeb3(_web3);
    }
  }, [account]);
  return /*#__PURE__*/React__default.createElement(web3Context.Provider, {
    value: _extends({
      activateInjected: activateInjected,
      sign: sign,
      recover: recover,
      verify: verify,
      active: active,
      account: account,
      error: error
    }, rest)
  }, children);
};
var Web3Provider = function Web3Provider(_ref2) {
  var children = _ref2.children,
      rest = _objectWithoutPropertiesLoose(_ref2, _excluded2$1);

  return /*#__PURE__*/React__default.createElement(core.Web3ReactProvider, {
    getLibrary: getLibrary
  }, /*#__PURE__*/React__default.createElement(Web3UtilProvider, rest, children));
};

var map = {};
var useLocalStorage = function useLocalStorage(name, atom, defaultValue) {
  var _useAtom = jotai.useAtom(atom),
      value = _useAtom[0],
      setValue = _useAtom[1];

  React.useEffect(function () {
    var storedValue = localStorage[name];

    try {
      var parsedValue;

      try {
        parsedValue = storedValue ? JSON.parse(storedValue) : defaultValue;
      } catch (e) {
        parsedValue = null;
      }

      if (!map[name]) {
        map[name] = true;
        setValue(parsedValue);
      }
    } catch (e) {
      throw new Error(e);
    }

    return function () {
      map[name] = false;
    };
  }, []);

  var setPersistentValue = function setPersistentValue(val) {
    var string = JSON.stringify(val);
    localStorage[name] = string;
    setValue(val);
  };

  return [value, setPersistentValue, setValue];
};

var _templateObject$1;

var _excluded$2 = ["Authorization"];
var useClientContext = function useClientContext() {
  var internalCtx = React.useContext(context);
  var web3Ctx = React.useContext(web3Context);
  return _extends({}, internalCtx, web3Ctx);
};
var compId;
var useAuth = function useAuth(useStrategy, auto) {
  var authenticate = function authenticate() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    try {
      return Promise.resolve(request(socket, {
        action: 'auth',
        phase: 'challenge'
      })).then(function (challenge) {
        return Promise.resolve(auth.apply(void 0, [challenge].concat(args))).then(function (data) {
          return function () {
            if (data.success) return _catch(function () {
              return Promise.resolve(request(socket, _extends({
                action: 'auth',
                phase: 'response'
              }, data))).then(function (response) {
                console.log("AUTH RESPONSE", response);
                setHeaders(_extends({}, headers, {
                  Authorization: "Bearer " + response
                }));
                setHasAuthed(true);
                return response;
              });
            }, function (e) {
              throw e;
            });
          }();
        });
      });
    } catch (e) {
      return Promise.reject(e);
    }
  };

  var _useContext = React.useContext(context),
      open = _useContext.open,
      socket = _useContext.socket,
      headers = _useContext.headers,
      setHeaders = _useContext.setHeaders;

  var _useStrategy = useStrategy(),
      auth = _useStrategy.authenticate,
      deauth = _useStrategy.logout,
      id = _useStrategy.id;

  var _useState = React.useState(false),
      authed = _useState[0],
      setHasAuthed = _useState[1];

  React.useEffect(function () {
    (function () {
      try {
        var _temp2 = function () {
          if (open && !authed) {
            return Promise.resolve(request(socket, {
              action: 'auth',
              phase: 'challenge',
              headers: headers
            })).then(function (challenge) {
              if (challenge.address) {
                setHasAuthed(true);
              } else {
                var newHeaders = _extends({}, headers);

                delete newHeaders.Authorization;
                debugger;
                setHeaders(newHeaders);
              }

              console.log("AUTO LOGIN", challenge);
            });
          }
        }();

        return _temp2 && _temp2.then ? _temp2.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [open, authed]);

  function logout() {
    var rest = _objectWithoutPropertiesLoose(headers, _excluded$2);

    debugger;
    deauth();
    setHeaders(rest);
  }

  React.useEffect(function () {
    (function () {
      try {
        var _temp4 = function () {
          if (id && compId && compId !== id && authed) {
            compId = id;
            return Promise.resolve(logout()).then(function () {});
          }
        }();

        return _temp4 && _temp4.then ? _temp4.then(function () {}) : void 0;
      } catch (e) {
        Promise.reject(e);
      }
    })();
  }, [id]);
  return {
    authenticate: authenticate,
    logout: logout
  };
};
var headerAtom = jotai.atom();

var _Provider = function _Provider(props) {
  var _props$urls = props.urls,
      urls = _props$urls === void 0 ? [] : _props$urls,
      url = props.url,
      _props$headers = props.headers,
      staticHeaders = _props$headers === void 0 ? {} : _props$headers,
      useAtom = props.useAtom;

  var _useState2 = React.useState(false),
      open = _useState2[0],
      setOpen = _useState2[1];

  var _useLocalStorage = useLocalStorage('headers', headerAtom, staticHeaders),
      headers = _useLocalStorage[0],
      setHeaders = _useLocalStorage[1];

  var _useState3 = React.useState(urls.map(function () {
    return false;
  })),
      secOpen = _useState3[0],
      setSecOpen = _useState3[1];

  var _useState4 = React.useState(null),
      error = _useState4[0],
      setError = _useState4[1];

  var allOpen = secOpen.reduce(function (all, cur) {
    return all && cur;
  }, open);
  if (!url) throw new Error("Missing property 'url' in Provider props.");
  var socket = React.useMemo(function () {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
    var ws = new WebSocket(url);
    ws.addEventListener('open', function open() {
      console.log("connected");
      setOpen(true);
    });
    ws.addEventListener('message', function (event) {
      try {
        return Promise.resolve(consume(event)).then(function () {});
      } catch (e) {
        return Promise.reject(e);
      }
    });
    return ws;
  }, [url, typeof window]);
  var sockets = React.useMemo(function () {
    return urls.map(function (url, i) {
      if (typeof window === 'undefined' || typeof WebSocket === 'undefined') return;
      var ws = new WebSocket(url);
      ws.addEventListener('open', function open() {
        console.log("connected");
        setSecOpen(function (secOpen) {
          var updated = [].concat(secOpen);
          updated[i] = true;
          setSecOpen(updated);
        });
      });
      ws.addEventListener('message', function (event) {
        try {
          return Promise.resolve(consume(event)).then(function () {});
        } catch (e) {
          return Promise.reject(e);
        }
      });
      return ws;
    });
  }, [typeof window]);
  React.useEffect(function () {
    on(socket, 'error', function () {
      var message = logger.error(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteralLoose(["Connecting to socket ", "."])), url);
      setError(message);
    });
  }, []);
  return /*#__PURE__*/React__default.createElement(context.Provider, {
    value: {
      setHeaders: setHeaders,
      socket: socket,
      sockets: sockets,
      open: open,
      secOpen: secOpen,
      allOpen: allOpen,
      useAtom: useAtom,
      headers: headers,
      error: error
    }
  }, /*#__PURE__*/React__default.createElement(Web3Provider, null, props.children));
};

var Provider = function Provider(props) {
  return /*#__PURE__*/React__default.createElement(jotai.Provider, null, /*#__PURE__*/React__default.createElement(_Provider, props));
};

var _excluded$3 = ["name", "children", "index"],
    _excluded2$2 = ["name", "children"],
    _excluded3$1 = ["children"],
    _excluded4 = ["name", "scope", "children", "index"],
    _excluded5 = ["children"];
var logger$1 = packageLogger.scope('ServerComponent');
var context$1 = React__default.createContext();
var internalContext = React__default.createContext();
var useAction = function useAction(name, handler, callback) {
  var _action$props, _action$props2;

  var ctx = React.useContext(internalContext);
  window.ctx = ctx;
  var _ctx$children = ctx.children,
      children = _ctx$children === void 0 ? [] : _ctx$children;
  var action = children.find(function (child) {
    return child.component === 'Action' && child.props.name === name;
  });
  if (!action) return function () {
    console.warn('Handler not available');
  };

  if (action && action !== null && action !== void 0 && (_action$props = action.props) !== null && _action$props !== void 0 && _action$props.fns && action !== null && action !== void 0 && (_action$props2 = action.props) !== null && _action$props2 !== void 0 && _action$props2.fns[handler]) {
    return action.props.fns[handler];
  }

  return action.handler;
};
var useProps = function useProps() {
  return React.useContext(context$1);
};
var ErrorBoundary = /*#__PURE__*/function (_React$Component) {
  _inheritsLoose(ErrorBoundary, _React$Component);

  function ErrorBoundary(props) {
    var _this;

    _this = _React$Component.call(this, props) || this;
    _this.state = {
      hasError: false
    };
    return _this;
  }

  ErrorBoundary.getDerivedStateFromError = function getDerivedStateFromError(error) {
    return {
      hasError: true
    };
  };

  var _proto = ErrorBoundary.prototype;

  _proto.render = function render() {
    if (this.state.hasError) {
      return /*#__PURE__*/React__default.createElement("h1", null, "Something went wrong.");
    }

    return this.props.children;
  };

  return ErrorBoundary;
}(React__default.Component);
var ChildComponent = function ChildComponent(props) {
  var ctx = React.useContext(internalContext);
  var _ctx$children2 = ctx.children,
      children = _ctx$children2 === void 0 ? [] : _ctx$children2;
  var index = props.index;
  var serverChildren = children.filter(function (child) {
    return child.component === "ClientComponent";
  });
  var serverProps = serverChildren[index];
  console.log("CHILD COMPONENT", serverChildren, serverProps, children, ctx);
  return props.children;
};
var useProps2 = function useProps2() {
  var _useContext = React.useContext(internalContext),
      props = _useContext.props;

  return props;
};
var ServerComponent2Child = function ServerComponent2Child(props) {
  var clientProps = _objectWithoutPropertiesLoose(props, _excluded$3);

  var _useContext2 = React.useContext(internalContext),
      serverChildren = _useContext2.children;

  return /*#__PURE__*/React__default.createElement(internalContext.Provider, {
    value: {
      props: {
        foo: 'bar'
      }
    }
  }, JSON.stringify(serverChildren));
};
var ServerComponent2 = function ServerComponent2(props) {
  var name = props.name,
      children = props.children,
      clientProps = _objectWithoutPropertiesLoose(props, _excluded2$2);

  var _useComponent = useComponent(name, {
    props: clientProps
  }),
      _useComponent$props = _useComponent.props,
      serverChildren = _useComponent$props.children,
      serverProps = _objectWithoutPropertiesLoose(_useComponent$props, _excluded3$1);

  var parent = React.useContext(internalContext);

  if (parent) {
    return /*#__PURE__*/React__default.createElement(ServerComponent2Child, props);
  }

  return /*#__PURE__*/React__default.createElement(internalContext.Provider, {
    value: {
      children: serverChildren,
      props: serverProps
    }
  }, children);
};
var ServerComponent = function ServerComponent(props) {
  var name = props.name,
      scope = props.scope,
      children = props.children,
      _props$index = props.index,
      index = _props$index === void 0 ? 0 : _props$index,
      clientProps = _objectWithoutPropertiesLoose(props, _excluded4);

  var parentCtx = React.useContext(internalContext);
  var rendered;

  if (parentCtx) {
    var parentChildren = [parentCtx.children].flat(2).filter(function (c) {
      return c.component === 'ClientComponent';
    });
    console.log("PARENT CHILDREN", parentChildren, [parentCtx.children].flat(2));
    var child = parentChildren.find(function (child) {
      return child.key === name;
    }) || parentChildren[index];
    rendered = child;
  }

  var component = useComponent(name, {
    scope: scope,
    props: clientProps
  }, rendered);
  var _component$props = component.props,
      serverProps = _component$props === void 0 ? {} : _component$props,
      resolved = component.resolved,
      error = component.error;

  var rest = _objectWithoutPropertiesLoose(serverProps, _excluded5);

  var mappedProps = Object.entries(rest).reduce(function (obj, _ref2) {
    var _Object$assign5, _Object$assign6;

    var key = _ref2[0],
        state = _ref2[1];

    if (state != null && typeof state !== 'string' && typeof state !== 'number') {
      state[Symbol["for"]('l0g.format')] = function () {
        return state.value;
      };
    }

    console.log("map props", key, state, resolved);

    if (resolved[key]) {
      var _Object$assign4;

      return Object.assign(obj, (_Object$assign4 = {}, _Object$assign4[key] = resolved[key], _Object$assign4));
    }

    if (state.id && state.key && state.scope) return Object.assign(obj, (_Object$assign5 = {}, _Object$assign5[key] = state.value, _Object$assign5));
    return Object.assign(obj, (_Object$assign6 = {}, _Object$assign6[key] = state, _Object$assign6));
  }, {});
  mappedProps.error = error;
  return /*#__PURE__*/React__default.createElement(internalContext.Provider, {
    value: _extends({}, serverProps, {
      name: name
    })
  }, /*#__PURE__*/React__default.createElement(context$1.Provider, {
    value: mappedProps
  }, children));
};
ServerComponent.childMap = {};
var Slot = function Slot() {};
var Action = function Action(props, name) {
  var _useContext3 = React.useContext(internalContext);

  return /*#__PURE__*/React__default.createElement(Fragment, null, props.children);
};

var web3Strategy = function web3Strategy() {
  var _useContext = React.useContext(web3Context),
      account = _useContext.account,
      activateInjected = _useContext.activateInjected,
      sign = _useContext.sign,
      deactivate = _useContext.deactivate;

  var _useState = React.useState(null);

  var _useState2 = React.useState(false);

  React.useEffect(function () {
    try {
      return Promise.resolve(activateInjected()).then(function () {});
    } catch (e) {
      Promise.reject(e);
    }
  }, []);

  var authenticate = function authenticate(challenge) {
    try {
      if (account) {
        return Promise.resolve(sign(challenge, account)).then(function (response) {
          return {
            challenge: challenge,
            response: response,
            success: true,
            strategy: 'web3'
          };
        });
      } else {
        return Promise.resolve(activateInjected()).then(function () {
          return {
            success: false
          };
        });
      }
    } catch (e) {
      return Promise.reject(e);
    }
  };

  return {
    authenticate: authenticate,
    id: account,
    logout: deactivate
  };
};

exports.Action = Action;
exports.ChildComponent = ChildComponent;
exports.ErrorBoundary = ErrorBoundary;
exports.Provider = Provider;
exports.ServerComponent = ServerComponent;
exports.ServerComponent2 = ServerComponent2;
exports.ServerComponent2Child = ServerComponent2Child;
exports.Slot = Slot;
exports.context = context$1;
exports.internalContext = internalContext;
exports.useAction = useAction;
exports.useAuth = useAuth;
exports.useClientContext = useClientContext;
exports.useComponent = useComponent;
exports.useProps = useProps;
exports.useProps2 = useProps2;
exports.useResponse = useResponse;
exports.useServerAtom = useServerAtom;
exports.useServerState = useServerState;
exports.useStream = useStream;
exports.web3Strategy = web3Strategy;
//# sourceMappingURL=index.js.map
