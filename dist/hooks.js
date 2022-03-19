"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useStream = exports.useServerState = exports.useResponse = exports.useComponent = void 0;

var _react = require("react");

var _jotai = require("jotai");

var _uuid = require("uuid");

var _consts = require("./consts");

var _context9 = require("./context");

var _logger = require("./lib/logger");

var _socket = require("./lib/util/socket");

var _util = require("./lib/util");

var _templateObject, _templateObject2, _templateObject3;

var _excluded = ["key", "strict", "defaultValue", "defer", "value", "scope", "suspend", "rendered", "requestType"],
    _excluded2 = ["strict", "suspend", "scope", "props", "host"],
    _excluded3 = ["error"];

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var stateCount = 0;

var isRenderResponse = function isRenderResponse(eventData) {
  return true;
};

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

var genEventName = join(_consts.EVENT_DELIM);

var genIdEventName = function genIdEventName(event) {
  return function (id) {
    return genEventName(event, id);
  };
};

var genSetStateEventName = genIdEventName(_consts.EVENT_SET_STATE);
var genCreateStateEventName = genIdEventName(_consts.EVENT_CREATE_STATE);
var genErrorEventName = genIdEventName(_consts.EVENT_ERROR);
var genComponentEvent = genIdEventName(_consts.EVENT_USE_COMPONENT);
var genActionEvent = genIdEventName(_consts.EVENT_EXECUTE_ACTION);
/**
 * @typedef {'$client' | "String"} StateScope - The scope of the state qwe
 */

/**
 * @typedef {Object} UseServerStateOptions
 * @property {String} key - The key of the state on the server e.g. 'foo'
 * @property {StateScope} scope - The scope of the state on the server e.g. bar
 * @property {Boolean} strict - Strict mode.
 * @property {Serializable} defaultValue - Initial value the server stores and sends back.
 */

/**
 * useServerState - Hook to request a state on a public/private state-server.
 * @param {*} clientDefaultValue - Initial value the client stores. e.g. "Loading..."
 * @param {UseServerStateOptions} options - Options
 */

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

var useStore = function useStore(store, key) {
  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      atom = _useState2[0],
      setAtom = _useState2[1];
};

var useStream = function useStream(name, def, host) {
  var _useContext = (0, _react.useContext)(_context9.context),
      sockets = _useContext.sockets,
      open = _useContext.open;

  host = (0, _util.assertGetSingleHost)(sockets, host);
  var socket = sockets[host];
  var id = (0, _react.useMemo)(function () {
    return (0, _uuid.v4)();
  }, []);

  var _useState3 = (0, _react.useState)(def || null),
      _useState4 = _slicedToArray(_useState3, 2),
      data = _useState4[0],
      setData = _useState4[1];

  (0, _react.useEffect)(function () {
    if (open) {
      (0, _socket.emit)(socket, {
        action: 'stream',
        name: name,
        id: id
      });
      (0, _socket.on)(socket, 'message', /*#__PURE__*/function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
          var data, json;
          return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return (0, _socket.consume)(event);

                case 2:
                  data = _context.sent;

                  if (!(data === 'ping')) {
                    _context.next = 5;
                    break;
                  }

                  return _context.abrupt("return");

                case 5:
                  json = (0, _socket.parseSocketResponse)(data);

                  if (data.id === id) {
                    setData(json);
                  }

                case 7:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
    }
  }, [open]);
  return data;
};

exports.useStream = useStream;
var stateLoadingStates = {};

var useServerState = function useServerState(clientDefaultValue, options) {
  var _alignUseServerStateA = alignUseServerStateArgs(clientDefaultValue, options),
      _alignUseServerStateA2 = _slicedToArray(_alignUseServerStateA, 2),
      clientDefaultValue = _alignUseServerStateA2[0],
      options = _alignUseServerStateA2[1];

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
      scope = _options$scope === void 0 ? _consts.DEFAULT_SCOPE : _options$scope,
      _options$suspend = _options.suspend,
      suspend = _options$suspend === void 0 ? false : _options$suspend,
      _options$rendered = _options.rendered,
      rendered = _options$rendered === void 0 ? null : _options$rendered,
      _options$requestType = _options.requestType,
      requestType = _options$requestType === void 0 ? 'request' : _options$requestType,
      rest = _objectWithoutProperties(_options, _excluded);

  var _options2 = options,
      _options2$host = _options2.host,
      host = _options2$host === void 0 ? null : _options2$host;
  var ctx = (0, _react.useContext)(_context9.context);

  try {
    var sockets = ctx.sockets,
        open = ctx.open;
    host = (0, _util.assertGetSingleHost)(sockets, host);
    var socket = sockets[host];
    if (!socket) throw new Error("Passed non existing host to useComponent. Please verify you defined '".concat(host, "' in your provider"));
    var defaultState = (0, _react.useMemo)(function () {
      return {
        value: clientDefaultValue,
        id: rest.id || null,
        scope: scope,
        key: key
      };
    }, []);
    var atm;

    if (!atoms.has("".concat(scope, ":").concat(key, ":").concat(rest.id))) {
      atm = (0, _jotai.atom)({
        defaultState: defaultState,
        clientId: increaseCount(),
        loading: false
      }); // Because multiple hooks may access the same component we need to bypass the react render cycle

      stateLoadingStates["".concat(scope, ":").concat(key)] = false;
      atoms.set("".concat(scope, ":").concat(key, ":").concat(rest.id), atm);
    } else {
      atm = atoms.get("".concat(scope, ":").concat(key, ":").concat(rest.id));
    }

    var _useAtom = (0, _jotai.useAtom)(atm),
        _useAtom2 = _slicedToArray(_useAtom, 2),
        state = _useAtom2[0],
        setState = _useAtom2[1];

    var id = state.id,
        error = state.error,
        clientId = state.clientId;
    (0, _react.useEffect)(function () {
      if (rest.id) {
        setState(_objectSpread(_objectSpread({}, state), {}, {
          id: rest.id
        }));
      }
    }, [rest.id]);

    var extendState = function extendState(data) {
      return setState(_objectSpread(_objectSpread({}, state), data));
    };

    var setLoading = function setLoading(loading) {
      stateLoadingStates["".concat(scope, ":").concat(key)] = loading;
      extendState({
        loading: loading
      });
    };

    var onTimeout = function onTimeout() {
      setState(function (state) {
        var id = state.id;

        if (!id) {
          return _objectSpread(_objectSpread({}, state), {}, {
            error: new Error('Cancelling state due to timeout')
          });
        }

        return state;
      });
      setLoading(false);
    };

    (0, _react.useEffect)(function () {
      var to;

      var onPageShow = function onPageShow() {
        _logger.orgLogger.debug(_templateObject || (_templateObject = _taggedTemplateLiteral(["Subscribing to state ", ""])), key);

        (0, _socket.emit)(socket, {
          action: _consts.EVENT_USE_STATE,
          key: key,
          defaultValue: value,
          scope: scope,
          requestId: clientId,
          options: _objectSpread({}, rest),
          requestType: requestType
        });
      };

      if (open && !id && !error && !defer && !stateLoadingStates["".concat(scope, ":").concat(key)]) {
        stateLoadingStates["".concat(scope, ":").concat(key)] = true;

        var onSetValue = /*#__PURE__*/function () {
          var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(event) {
            var eventData, data;
            return regeneratorRuntime.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _context2.next = 2;
                    return (0, _socket.consume)(event);

                  case 2:
                    eventData = _context2.sent;

                    if (!(eventData === 'ping')) {
                      _context2.next = 5;
                      break;
                    }

                    return _context2.abrupt("return");

                  case 5:
                    data = (0, _socket.parseSocketResponse)(eventData);

                    if (!(eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id) && typeof data.value === 'undefined')) {
                      _context2.next = 8;
                      break;
                    }

                    return _context2.abrupt("return", state);

                  case 8:
                    if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id)) {
                      setState(function (state) {
                        return _objectSpread(_objectSpread({}, state), data);
                      });
                    }

                  case 9:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2);
          }));

          return function onSetValue(_x2) {
            return _ref2.apply(this, arguments);
          };
        }();

        (0, _socket.onMessage)(socket, onSetValue);
        onPageShow();
        window.addEventListener('pageshow', onPageShow);
      }

      return function () {
        (0, _socket.off)(socket, 'message', onSetValue);
        window.removeEventListener('pageshow', onPageShow);
        stateLoadingStates["".concat(scope, ":").concat(key)] = false; // stateLoadingStates[`${scope}:${key}`]
        // [createStateEvent].forEach(event => socket.removeAllListeners(event));
      };
    }, [open, defer, scope, key]);
    /*
     *   This hook attaches listeners for the setValue event for existent states
     *   Existent means we already obtained the states id
     *   The value of the hooks atom will be updated if the id of the state matches the id of they
     */

    (0, _react.useEffect)(function () {
      if (id) {
        if (!defer && id) {
          var onSetValue = /*#__PURE__*/function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
              var eventData, data;
              return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.next = 2;
                      return (0, _socket.consume)(event);

                    case 2:
                      eventData = _context3.sent;

                      if (!(eventData === 'ping')) {
                        _context3.next = 5;
                        break;
                      }

                      return _context3.abrupt("return");

                    case 5:
                      data = (0, _socket.parseSocketResponse)(eventData);

                      if (!(eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id) && typeof data.value === 'undefined')) {
                        _context3.next = 8;
                        break;
                      }

                      return _context3.abrupt("return", state);

                    case 8:
                      if (eventData.action === 'setValue' && (clientId === eventData.requestId || id === data.id)) {
                        setState(function (state) {
                          delete state.error;
                          return _objectSpread(_objectSpread({}, state), data);
                        });
                      }

                    case 9:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, _callee3);
            }));

            return function onSetValue() {
              return _ref3.apply(this, arguments);
            };
          }();

          (0, _socket.on)(socket, 'message', onSetValue);

          var onError = /*#__PURE__*/function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(event) {
              var data, err;
              return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      _context4.next = 2;
                      return (0, _socket.consume)(event);

                    case 2:
                      data = _context4.sent;

                      if (!(data === 'ping')) {
                        _context4.next = 5;
                        break;
                      }

                      return _context4.abrupt("return");

                    case 5:
                      if (!(data.type === 'error' && id === data.id)) {
                        _context4.next = 10;
                        break;
                      }

                      _context4.next = 8;
                      return (0, _socket.parseSocketResponse)(data);

                    case 8:
                      err = _context4.sent;
                      extendState({
                        error: new Error(err.message)
                      });

                    case 10:
                    case "end":
                      return _context4.stop();
                  }
                }
              }, _callee4);
            }));

            return function onError(_x3) {
              return _ref4.apply(this, arguments);
            };
          }();

          (0, _socket.on)(socket, 'message', onError);
        }
      }

      return function () {
        if (id) {
          (0, _socket.off)(socket, 'message', onSetValue);
          (0, _socket.off)(socket, 'message', onError);
        }
      };
    });
    (0, _react.useEffect)(function () {
      if (strict && error) {
        throw error;
      }
    }, [error]);
    (0, _react.useEffect)(function () {// if (id || error) {
      // setLoading(false);
      // }
    }, [id, error, key]);

    var setServerState = function setServerState(value) {
      (0, _socket.emit)(socket, {
        action: _consts.EVENT_SET_STATE,
        id: id,
        key: key,
        value: value,
        scope: scope
      });
    };

    if (state.error) {
      if (strict) {
        throw state.error;
      }

      return [state.error, state.value];
    }

    if (suspend && !state.value && stateLoadingStates["".concat(scope, ":").concat(key)] && !id) {
      // return [state.value, createStateEvent];
      throw new Promise(function () {});
    }

    if (!key && options.defer) {
      return [clientDefaultValue || null];
    } // baseLogger.debug`Returning live state ${state} ${key} with value ${state.value} ${clientDefaultValue}`


    return [typeof state.value === 'undefined' ? clientDefaultValue : state.value, setServerState];
  } catch (e) {
    if (!ctx) throw new Error('No available context. Are you missing a Provider?');
    throw e;
  }
};

exports.useServerState = useServerState;

var useResponse = function useResponse(fn, action, _ref5) {
  var _ref5$keepAlive = _ref5.keepAlive,
      keepAlive = _ref5$keepAlive === void 0 ? false : _ref5$keepAlive,
      _ref5$host = _ref5.host,
      host = _ref5$host === void 0 ? null : _ref5$host;
  var ctx = (0, _react.useContext)(_context9.context);
  var sockets = ctx.sockets;
  host = (0, _util.assertGetSingleHost)(sockets, host);
  var socket = sockets[host];

  var _useState5 = (0, _react.useState)(null),
      _useState6 = _slicedToArray(_useState5, 2),
      id = _useState6[0],
      setId = _useState6[1];

  (0, _react.useEffect)(function () {
    if (!id) return;
    (0, _socket.onMessage)(socket, /*#__PURE__*/function () {
      var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(event) {
        var eventData, data;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return (0, _socket.consume)(event);

              case 2:
                eventData = _context5.sent;

                if (!(eventData === 'ping')) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt("return");

              case 5:
                data = (0, _socket.parseSocketResponse)(eventData);

                if (eventData.id === id) {
                  fn(data);
                }

              case 7:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      return function (_x4) {
        return _ref6.apply(this, arguments);
      };
    }());
  }, [id]);
  return function () {
    var id = action.apply(void 0, arguments);
    setId(id);
  };
};

exports.useResponse = useResponse;
var componentAtoms = new Map();
var loadingStates = {};
/**
 * @param {boolean} strict - Throws errors in strict mode
 * @param {boolean} suspend - Throws a promise while loading
 * @param {string} scope - The scope of the components store
 * @param {props} scope - The clientside props passed to the backend component.
 */

/**
 * useComponent - Hook that renders serverside components
 * @param {*} componentKey - The key of the serverside component
 * @param {*} options - Options

 */
var useComponent = function useComponent(componentKey, _ref7, rendered) {
  var _ref7$strict = _ref7.strict,
      strict = _ref7$strict === void 0 ? false : _ref7$strict,
      _ref7$suspend = _ref7.suspend,
      suspend = _ref7$suspend === void 0 ? false : _ref7$suspend,
      _ref7$scope = _ref7.scope,
      scope = _ref7$scope === void 0 ? _consts.DEFAULT_SCOPE : _ref7$scope,
      clientProps = _ref7.props,
      _ref7$host = _ref7.host,
      host = _ref7$host === void 0 ? null : _ref7$host,
      rest = _objectWithoutProperties(_ref7, _excluded2);

  var ctx = (0, _react.useContext)(_context9.context);

  try {
    var _ref8, _ref10, _ref10$props, _ref10$props$children;

    var sockets = ctx.sockets,
        open = ctx.open,
        headers = ctx.headers; // eslint-disable-next-line no-param-reassign

    host = (0, _util.assertGetSingleHost)(sockets, host);
    var socket = sockets[host];
    if (!socket) throw new Error("Passed non existing host to useComponent. Please verify you defined '".concat(host, "' in your provider"));
    var defaultState = (0, _react.useMemo)(function () {
      return {
        component: rendered,
        props: {},
        scope: scope,
        key: componentKey,
        loading: false
      };
    }, []);
    var atm;

    if (!componentAtoms.has("".concat(scope, ":").concat(componentKey))) {
      atm = (0, _jotai.atom)({
        defaultState: defaultState
      });
      loadingStates["".concat(scope, ":").concat(componentKey)] = false;
      componentAtoms.set("".concat(scope, ":").concat(componentKey), atm);
    } else {
      atm = componentAtoms.get("".concat(scope, ":").concat(componentKey));
    }

    var _useAtom3 = (0, _jotai.useAtom)(atm),
        _useAtom4 = _slicedToArray(_useAtom3, 2),
        internalState = _useAtom4[0],
        setState = _useAtom4[1];

    var extendState = function extendState(data) {
      return setState(_objectSpread(_objectSpread({}, internalState), data));
    };

    var setLoading = function setLoading(loading) {
      return extendState({
        loading: loading
      });
    };

    var component = internalState.component;

    var _useServerState = useServerState(component, {
      key: componentKey,
      scope: 'public',
      defer: !component && !rendered,
      requestType: 'subscribe',
      rendered: rendered
    }),
        _useServerState2 = _slicedToArray(_useServerState, 1),
        componentState = _useServerState2[0]; // useTraceUpdate(internalState);


    var resolved = {};
    var keys = Object.keys(((_ref8 = componentState || rendered) === null || _ref8 === void 0 ? void 0 : _ref8.props) || {});

    if (keys.length > 15) {
      _logger.orgLogger.warning(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["Component has over 15 states. Components are currently limited to ", " states"])), 15);
    }

    keys.length = 15;
    /**
     * We cannot use array iterators because it skips over empty entries.
     */
    // eslint-disable-next-line no-restricted-syntax

    for (var _i2 = 0, _keys = keys; _i2 < _keys.length; _i2++) {
      var _ref9;

      var propKey = _keys[_i2];
      var serverProps = ((_ref9 = componentState || rendered) === null || _ref9 === void 0 ? void 0 : _ref9.props) || {};
      var state = serverProps[propKey] || {};
      var resolvedState = useServerState(state.value, {
        key: state.key,
        scope: state.scope,
        id: state.id,
        defer: !state.id || !state.key || !state.scope
      });

      if (state.id && state.key && state.scope) {
        if (typeof resolvedState[0] !== 'undefined') {
          var _resolvedState = _slicedToArray(resolvedState, 2),
              value = _resolvedState[0],
              setValue = _resolvedState[1];

          var setKey = "set".concat(propKey[0].toUpperCase()).concat(propKey.slice(1));
          resolved[propKey] = value;
          resolved[setKey] = setValue;
        }
      }
    }
    /** Bind action functions */


    (_ref10 = componentState || rendered) === null || _ref10 === void 0 ? void 0 : (_ref10$props = _ref10.props) === null || _ref10$props === void 0 ? void 0 : (_ref10$props$children = _ref10$props.children) === null || _ref10$props$children === void 0 ? void 0 : _ref10$props$children.filter(function (child) {
      return child.component === 'Action';
    }).forEach(function (action) {
      action.props.fns = action.props.handler.reduce(function (fns, handler) {
        return Object.assign(fns, _defineProperty({}, handler, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
          var id,
              _len4,
              args,
              _key4,
              res,
              errObj,
              _args6 = arguments;

          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  id = (0, _uuid.v4)();
                  _context6.prev = 1;

                  for (_len4 = _args6.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                    args[_key4] = _args6[_key4];
                  }

                  _context6.next = 5;
                  return (0, _socket.request)(socket, {
                    action: 'call',
                    props: clientProps,
                    id: id,
                    componentKey: componentKey,
                    name: action.props.name,
                    handler: handler,
                    args: args,
                    headers: headers
                  });

                case 5:
                  res = _context6.sent;
                  return _context6.abrupt("return", res);

                case 9:
                  _context6.prev = 9;
                  _context6.t0 = _context6["catch"](1);
                  errObj = new Error(_context6.t0.message);
                  Object.assign(errObj, _context6.t0);
                  extendState({
                    error: errObj
                  });
                  throw _context6.t0;

                case 15:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6, null, [[1, 9]]);
        }))));
      }, {});
    });

    var _ref12 = component || {},
        props = _ref12.props,
        error = _ref12.error;

    var onTimeout = function onTimeout() {};

    (0, _react.useEffect)(function () {
      var to;
      var onRender;
      var onError;
      var onLog;

      if (open && !props && !error && !loadingStates["".concat(scope, ":").concat(componentKey)]) {
        to = setTimeout(onTimeout, 15000);
        loadingStates["".concat(scope, ":").concat(componentKey)] = true;

        onRender = /*#__PURE__*/function () {
          var _ref13 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(event) {
            var eventData, data, _error, _rest;

            return regeneratorRuntime.wrap(function _callee7$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.prev = 0;
                    _context7.next = 3;
                    return (0, _socket.consume)(event);

                  case 3:
                    eventData = _context7.sent;

                    if (!(eventData === 'ping')) {
                      _context7.next = 6;
                      break;
                    }

                    return _context7.abrupt("return");

                  case 6:
                    /** TODO: fix base scope === 'public' */
                    if (eventData.action === 'render' && eventData.key === componentKey) {
                      data = (0, _socket.parseSocketResponse)(eventData);
                      _error = internalState.error, _rest = _objectWithoutProperties(internalState, _excluded3);
                      setState(_objectSpread(_objectSpread({}, _rest), {}, {
                        component: data,
                        loading: false
                      }));
                    }

                    _context7.next = 12;
                    break;

                  case 9:
                    _context7.prev = 9;
                    _context7.t0 = _context7["catch"](0);

                    _logger.orgLogger.error(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["Error in render result ", "."])), _context7.t0);

                  case 12:
                  case "end":
                    return _context7.stop();
                }
              }
            }, _callee7, null, [[0, 9]]);
          }));

          return function onRender(_x5) {
            return _ref13.apply(this, arguments);
          };
        }();

        (0, _socket.onMessage)(socket, onRender);
        /* I'm not sure if this is the proper place to handle errors from a component. There's no serverside mechanism that sends error messages from components */

        onError = /*#__PURE__*/function () {
          var _ref14 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(event) {
            var data, err, errObj;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    _context8.next = 2;
                    return (0, _socket.consume)(event);

                  case 2:
                    data = _context8.sent;

                    if (!(data === 'ping')) {
                      _context8.next = 5;
                      break;
                    }

                    return _context8.abrupt("return");

                  case 5:
                    if (!(data.type === 'error' && data.key === componentKey)) {
                      _context8.next = 12;
                      break;
                    }

                    _context8.next = 8;
                    return (0, _socket.parseSocketResponse)(data);

                  case 8:
                    err = _context8.sent;
                    errObj = new Error(err.message);
                    Object.assign(errObj, err);
                    extendState({
                      error: errObj,
                      loading: false
                    });

                  case 12:
                  case "end":
                    return _context8.stop();
                }
              }
            }, _callee8);
          }));

          return function onError(_x6) {
            return _ref14.apply(this, arguments);
          };
        }();

        (0, _socket.onMessage)(socket, onError);

        onLog = function onLog(data) {
          var _orgLogger$scope$setM;

          data.tag[0].raw = 'Fake Tagged Template String Arg';

          (_orgLogger$scope$setM = _logger.orgLogger.scope(data.scope).setMessageLevel(data.level)).log.apply(_orgLogger$scope$setM, _toConsumableArray(data.tag));
        };

        (0, _socket.on)(socket, 'log', onLog);
        (0, _socket.emit)(socket, {
          action: _consts.EVENT_USE_COMPONENT,
          key: componentKey,
          scope: scope || 'base',
          props: clientProps,
          options: _objectSpread({}, rest),
          headers: headers
        });
        setLoading(true);
      }

      (function () {
        (0, _socket.off)(socket, 'message', onRender);
        (0, _socket.off)(socket, 'message', onError);
        (0, _socket.off)(socket, 'message', onLog);
        setLoading(false);
      });
    }, [open]);
    (0, _react.useEffect)(function () {
      if (open && !error) {
        (0, _socket.emit)(socket, {
          action: _consts.EVENT_USE_COMPONENT,
          key: componentKey,
          scope: scope || 'base',
          props: clientProps,
          options: _objectSpread({}, rest),
          headers: headers
        });
        setLoading(true);
      }
    }, [headers === null || headers === void 0 ? void 0 : headers.Authorization]);
    (0, _react.useEffect)(function () {
      if (strict && error) {
        throw new Error(error);
      }
    }, [error]);

    if (internalState.error && !component && !rendered) {
      return internalState;
    }

    if (componentState instanceof Error) {
      throw componentState;
    }

    if (!component && internalState.loading) {
      if (suspend) {
        throw new Promise(function () {});
      } else {
        return defaultState;
      }
    }

    return _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, rendered || {}), componentState), internalState), {}, {
      resolved: resolved
    });
  } catch (e) {
    if (!ctx) throw new Error('No available context. Are you missing a Provider?');
    throw e;
  }
};

exports.useComponent = useComponent;