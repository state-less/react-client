"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  RENDER_COMPONENT: true,
  UNMOUNT_COMPONENT: true,
  MOUNT_COMPONENT: true,
  UPDATE_STATE: true,
  UPDATE_COMPONENT: true,
  GET_STATE: true,
  SET_STATE: true,
  CALL_FUNCTION: true,
  useLocalStorage: true,
  renderCache: true,
  resetCache: true,
  renderComponent: true,
  useComponent: true,
  useServerState: true
};
exports.useServerState = exports.useLocalStorage = exports.useComponent = exports.resetCache = exports.renderComponent = exports.renderCache = exports.UPDATE_STATE = exports.UPDATE_COMPONENT = exports.UNMOUNT_COMPONENT = exports.SET_STATE = exports.RENDER_COMPONENT = exports.MOUNT_COMPONENT = exports.GET_STATE = exports.CALL_FUNCTION = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _client = require("@apollo/client");
var _react = require("@apollo/client/react");
var _react2 = _interopRequireWildcard(require("react"));
var _uuid = require("uuid");
var _utilities = require("@apollo/client/utilities");
var _jotai = require("jotai");
var _instances = require("./lib/instances.js");
var _SSR = require("./lib/util/SSR.js");
var _SSRProvider = require("./provider/SSRProvider.jsx");
var _cookie = _interopRequireDefault(require("cookie"));
var _AuthenticationProvider = require("./provider/AuthenticationProvider.jsx");
Object.keys(_AuthenticationProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _AuthenticationProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _AuthenticationProvider[key];
    }
  });
});
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || (0, _typeof2["default"])(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var jwt = null;
if (typeof window === 'undefined') {
  jwt = await Promise.resolve().then(function () {
    return _interopRequireWildcard(require('jsonwebtoken'));
  });
}
var RENDER_COMPONENT = (0, _client.gql)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  query MyQuery($key: ID!, $props: JSON) {\n    renderComponent(key: $key, props: $props) {\n      rendered {\n        ... on ServerSideProps {\n          key\n          props\n          children\n        }\n        __typename\n        ... on Server {\n          version\n          uptime\n          platform\n          components: children {\n            __typename\n            ... on ServerSideProps {\n              props\n              children\n            }\n          }\n        }\n      }\n    }\n  }\n"])));
exports.RENDER_COMPONENT = RENDER_COMPONENT;
var UNMOUNT_COMPONENT = (0, _client.gql)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  query MyQuery($key: ID!) {\n    unmountComponent(key: $key)\n  }\n"])));
exports.UNMOUNT_COMPONENT = UNMOUNT_COMPONENT;
var MOUNT_COMPONENT = (0, _client.gql)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  query MyQuery($key: ID!, $props: JSON) {\n    mountComponent(key: $key, props: $props)\n  }\n"])));
exports.MOUNT_COMPONENT = MOUNT_COMPONENT;
var UPDATE_STATE = (0, _client.gql)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  subscription MyQuery($key: ID!, $scope: String!) {\n    updateState(key: $key, scope: $scope) {\n      id\n      value\n    }\n  }\n"])));
exports.UPDATE_STATE = UPDATE_STATE;
var UPDATE_COMPONENT = (0, _client.gql)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  subscription MyQuery(\n    $key: ID!\n    $scope: String!\n    $id: String!\n    $bearer: String\n  ) {\n    updateComponent(key: $key, scope: $scope, id: $id, bearer: $bearer) {\n      rendered {\n        ... on ServerSideProps {\n          key\n          props\n          children\n        }\n        __typename\n        ... on Server {\n          version\n          uptime\n          platform\n          components: children {\n            __typename\n            ... on ServerSideProps {\n              props\n              children\n            }\n          }\n        }\n      }\n    }\n  }\n"])));
exports.UPDATE_COMPONENT = UPDATE_COMPONENT;
var GET_STATE = (0, _client.gql)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  query MyQuery($key: ID!, $scope: String!) {\n    getState(key: $key, scope: $scope) {\n      id\n      value\n    }\n  }\n"])));
exports.GET_STATE = GET_STATE;
var SET_STATE = (0, _client.gql)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2["default"])(["\n  mutation MyMutation($key: ID!, $scope: String!, $value: JSON) {\n    setState(key: $key, scope: $scope, value: $value) {\n      key\n      id\n      value\n      scope\n    }\n  }\n"])));
exports.SET_STATE = SET_STATE;
var CALL_FUNCTION = (0, _client.gql)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2["default"])(["\n  mutation MyMutation($key: ID!, $prop: String!, $args: JSON) {\n    callFunction(key: $key, prop: $prop, args: $args)\n  }\n"])));
exports.CALL_FUNCTION = CALL_FUNCTION;
var atoms = {};
var getInitialValue = function getInitialValue(key, initialValue, _ref) {
  var cookie = _ref.cookie;
  try {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    var item = window.localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(initialValue));
      if (cookie) {
        document.cookie = "".concat(cookie, "=").concat(initialValue);
      }
      return initialValue;
    }
    if (cookie) {
      document.cookie = "".concat(cookie, "=").concat(item);
    }
    return JSON.parse(item);
  } catch (error) {
    console.log(error);
    return initialValue;
  }
};
var useLocalStorage = function useLocalStorage(key, initialValue) {
  var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    _ref2$cookie = _ref2.cookie,
    cookie = _ref2$cookie === void 0 ? null : _ref2$cookie,
    _ref2$ssr = _ref2.ssr,
    ssr = _ref2$ssr === void 0 ? false : _ref2$ssr;
  var keyAtom = atoms[key] || (atoms[key] = (0, _jotai.atom)(getInitialValue(key, initialValue, {
    cookie: cookie
  })));
  var _useAtom = (0, _jotai.useAtom)(keyAtom),
    _useAtom2 = (0, _slicedToArray2["default"])(_useAtom, 2),
    storedValue = _useAtom2[0],
    setStoredValue = _useAtom2[1];
  var setValue = function setValue(value) {
    try {
      var valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      if (cookie) {
        console.log('SETTING COOKIE', cookie, JSON.stringify(valueToStore));
        document.cookie = "".concat(cookie, "=").concat(JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (ssr) return [initialValue, setValue];
  return [storedValue, setValue];
};
exports.useLocalStorage = useLocalStorage;
var renderCache = {};
exports.renderCache = renderCache;
var resetCache = function resetCache() {
  Object.keys(renderCache).forEach(function (key) {
    delete renderCache[key];
  });
};
exports.resetCache = resetCache;
var renderComponent = function renderComponent(key, options) {
  var _ref3 = options || {},
    client = _ref3.client,
    session = _ref3.session;
  var prom;
  if (renderCache[key]) {
    prom = renderCache[key];
  } else {
    var res = client.query({
      query: RENDER_COMPONENT,
      variables: {
        key: key,
        props: options.props
      },
      fetchPolicy: 'network-only',
      context: {
        headers: {
          'X-Unique-Id': session.id,
          Authorization: session.token ? "Bearer ".concat(session.token) : undefined
        }
      }
    });
    prom = (0, _SSR.wrapPromise)(res);
    renderCache[key] = prom;
  }
  console.log('RENDERING SSR', key, prom);
  return renderCache[key];
};
exports.renderComponent = renderComponent;
var useComponent = function useComponent(key) {
  var _options$data, _req$headers, _queryData$renderComp6, _queryData$renderComp7, _options$data4, _queryData$renderComp11, _queryData$renderComp12, _lastMutationResult$e;
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _ref4 = options || {},
    client = _ref4.client;
  var _React$useContext = _react2["default"].useContext((0, _client.getApolloContext)()),
    _React$useContext$cli = _React$useContext.client,
    providedClient = _React$useContext$cli === void 0 ? null : _React$useContext$cli;
  var _useState = (0, _react2.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    lastMutationResult = _useState2[0],
    setLastMutationResult = _useState2[1];
  var _useState3 = (0, _react2.useState)((options === null || options === void 0 ? void 0 : options.skip) || !!(options !== null && options !== void 0 && (_options$data = options.data) !== null && _options$data !== void 0 && _options$data.key)),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    skip = _useState4[0],
    setSkip = _useState4[1];
  var _useState5 = (0, _react2.useState)(null),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    subscribed = _useState6[0],
    setSubcribed = _useState6[1];
  var actualClient = client || providedClient;
  if (!actualClient) {
    throw new Error('No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.');
  }
  var _initialSession = _instances.initialSession;
  var serverId = (0, _uuid.v4)();
  var _useContext = (0, _react2.useContext)(_SSRProvider.ssrContext),
    req = _useContext.req;
  if (req !== null && req !== void 0 && (_req$headers = req.headers) !== null && _req$headers !== void 0 && _req$headers.cookie && options.ssr) {
    var _req$headers2;
    var parsed = _cookie["default"].parse(req === null || req === void 0 ? void 0 : (_req$headers2 = req.headers) === null || _req$headers2 === void 0 ? void 0 : _req$headers2.cookie);
    var decoded = jwt.decode(parsed.token);
    serverId = parsed['x-react-server-id'];
    _initialSession = _objectSpread(_objectSpread({}, decoded), {}, {
      id: serverId,
      token: parsed.token
    });
  }
  var _useLocalStorage = useLocalStorage('id', serverId, {
      cookie: 'x-react-server-id',
      ssr: options.ssr
    }),
    _useLocalStorage2 = (0, _slicedToArray2["default"])(_useLocalStorage, 1),
    id = _useLocalStorage2[0];
  var _useLocalStorage3 = useLocalStorage('session', _initialSession, {
      ssr: options.ssr
    }),
    _useLocalStorage4 = (0, _slicedToArray2["default"])(_useLocalStorage3, 1),
    session = _useLocalStorage4[0];
  var result;
  var fetchPolicy = options.ssr ? 'network-only' : 'cache-first';
  var queryOptions = {
    client: actualClient,
    variables: {
      key: key,
      props: options.props
    },
    fetchPolicy: fetchPolicy,
    context: {
      headers: {
        'X-Unique-Id': id,
        Authorization: session.token ? "Bearer ".concat(session.token) : undefined
      }
    },
    skip: skip
  };
  if (options.suspend) {
    try {
      result = (0, _react.useSuspenseQuery)(RENDER_COMPONENT, queryOptions);
    } catch (prom) {
      renderCache[key] = renderCache[key] || (0, _SSR.wrapPromise)(prom);
      throw prom;
    }
  } else {
    result = (0, _react.useQuery)(RENDER_COMPONENT, queryOptions);
  }
  var _result = result,
    queryData = _result.data,
    error = _result.error,
    loading = _result.loading,
    refetch = _result.refetch;
  /**
   * This needs to be done manually because we don't have the key of the component before the query above finished.
   * useSubscription doesn't work because it doesn't resubscribe if the key changes.
   */
  (0, _react2.useEffect)(function () {
    var _queryData$renderComp, _queryData$renderComp2;
    if (!(queryData !== null && queryData !== void 0 && (_queryData$renderComp = queryData.renderComponent) !== null && _queryData$renderComp !== void 0 && (_queryData$renderComp2 = _queryData$renderComp.rendered) !== null && _queryData$renderComp2 !== void 0 && _queryData$renderComp2.key) || (subscribed === null || subscribed === void 0 ? void 0 : subscribed._state) === 'ready') return;
    var can;
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var _queryData$renderComp3, _queryData$renderComp4;
      var sub;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return actualClient.subscribe({
              query: UPDATE_COMPONENT,
              variables: {
                key: queryData === null || queryData === void 0 ? void 0 : (_queryData$renderComp3 = queryData.renderComponent) === null || _queryData$renderComp3 === void 0 ? void 0 : (_queryData$renderComp4 = _queryData$renderComp3.rendered) === null || _queryData$renderComp4 === void 0 ? void 0 : _queryData$renderComp4.key,
                scope: 'global',
                bearer: session.token ? "Bearer ".concat(session.token) : undefined,
                id: id
              },
              context: {
                headers: {
                  'X-Unique-Id': id,
                  Authorization: session.token ? "Bearer ".concat(session.token) : undefined
                }
              }
            });
          case 2:
            sub = _context.sent;
            can = sub.subscribe(function (subscriptionData) {
              var _queryData$renderComp5, _subscriptionData$dat, _subscriptionData$dat2;
              actualClient.cache.writeQuery({
                query: RENDER_COMPONENT,
                variables: {
                  key: key,
                  props: options.props
                },
                data: {
                  renderComponent: {
                    rendered: _objectSpread(_objectSpread({}, queryData === null || queryData === void 0 ? void 0 : (_queryData$renderComp5 = queryData.renderComponent) === null || _queryData$renderComp5 === void 0 ? void 0 : _queryData$renderComp5.rendered), subscriptionData === null || subscriptionData === void 0 ? void 0 : (_subscriptionData$dat = subscriptionData.data) === null || _subscriptionData$dat === void 0 ? void 0 : (_subscriptionData$dat2 = _subscriptionData$dat.updateComponent) === null || _subscriptionData$dat2 === void 0 ? void 0 : _subscriptionData$dat2.rendered)
                  }
                }
              });
              setSkip(false);
            });
            setSubcribed(can);
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
    return function () {
      var _can, _can$unsubscribe;
      (_can = can) === null || _can === void 0 ? void 0 : (_can$unsubscribe = _can.unsubscribe) === null || _can$unsubscribe === void 0 ? void 0 : _can$unsubscribe.call(_can);
    };
  }, [queryData === null || queryData === void 0 ? void 0 : (_queryData$renderComp6 = queryData.renderComponent) === null || _queryData$renderComp6 === void 0 ? void 0 : (_queryData$renderComp7 = _queryData$renderComp6.rendered) === null || _queryData$renderComp7 === void 0 ? void 0 : _queryData$renderComp7.key, queryData]);

  /**
   * This needs to be done manually because we don't have the key of the component before the query above finished.
   * useSubscription doesn't work because it doesn't resubscribe if the key changes. ASD
   */
  (0, _react2.useEffect)(function () {
    var _options$data2, _queryData$renderComp8, _queryData$renderComp9;
    if (!(options !== null && options !== void 0 && (_options$data2 = options.data) !== null && _options$data2 !== void 0 && _options$data2.key) || queryData !== null && queryData !== void 0 && (_queryData$renderComp8 = queryData.renderComponent) !== null && _queryData$renderComp8 !== void 0 && (_queryData$renderComp9 = _queryData$renderComp8.rendered) !== null && _queryData$renderComp9 !== void 0 && _queryData$renderComp9.key) return;
    var can;
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var _options$data3;
      var sub;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return actualClient.subscribe({
              query: UPDATE_COMPONENT,
              variables: {
                key: options === null || options === void 0 ? void 0 : (_options$data3 = options.data) === null || _options$data3 === void 0 ? void 0 : _options$data3.component,
                scope: 'global',
                bearer: session.token ? "Bearer ".concat(session.token) : undefined,
                id: id
              },
              context: {
                headers: {
                  'X-Unique-Id': id,
                  Authorization: session.token ? "Bearer ".concat(session.token) : undefined
                }
              }
            });
          case 2:
            sub = _context2.sent;
            can = sub.subscribe(function (subscriptionData) {
              var _queryData$renderComp10, _subscriptionData$dat3, _subscriptionData$dat4;
              if (!options.skip) setSkip(false);
              actualClient.cache.writeQuery({
                query: RENDER_COMPONENT,
                variables: {
                  key: key,
                  props: options.props
                },
                data: {
                  renderComponent: {
                    rendered: _objectSpread(_objectSpread({}, queryData === null || queryData === void 0 ? void 0 : (_queryData$renderComp10 = queryData.renderComponent) === null || _queryData$renderComp10 === void 0 ? void 0 : _queryData$renderComp10.rendered), subscriptionData === null || subscriptionData === void 0 ? void 0 : (_subscriptionData$dat3 = subscriptionData.data) === null || _subscriptionData$dat3 === void 0 ? void 0 : (_subscriptionData$dat4 = _subscriptionData$dat3.updateComponent) === null || _subscriptionData$dat4 === void 0 ? void 0 : _subscriptionData$dat4.rendered)
                  }
                }
              });
            });
            setSubcribed(can);
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
    return function () {
      var _can2, _can2$unsubscribe;
      (_can2 = can) === null || _can2 === void 0 ? void 0 : (_can2$unsubscribe = _can2.unsubscribe) === null || _can2$unsubscribe === void 0 ? void 0 : _can2$unsubscribe.call(_can2);
    };
  }, [options === null || options === void 0 ? void 0 : (_options$data4 = options.data) === null || _options$data4 === void 0 ? void 0 : _options$data4.key, JSON.stringify(options.props)]);

  // useEffect(() => {
  //   if (!subscribed) return;
  //   console.log('Component mounted', subscribed);
  //   if (actualClient) {
  //     (async () => {
  //       const cleaned = await actualClient.query({
  //         query: MOUNT_COMPONENT,
  //         variables: {
  //           key,
  //           props: options?.props,
  //         },
  //         fetchPolicy: 'network-only',
  //         context: {
  //           headers: {
  //             'X-Unique-Id': id,
  //             Authorization: session.token
  //               ? `Bearer ${session.token}`
  //               : undefined,
  //           },
  //         },
  //       });
  //       console.log('Unmounted', cleaned);
  //     })();
  //   }

  var unload = function unload(e) {
    if (unloading) return;
    // Cancel the event
    e.preventDefault();
    (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            unloading = true;
            _context3.next = 3;
            return actualClient.query({
              query: UNMOUNT_COMPONENT,
              variables: {
                key: key
              },
              fetchPolicy: 'network-only',
              context: {
                headers: {
                  'X-Unique-Id': id,
                  Authorization: session.token ? "Bearer ".concat(session.token) : undefined
                }
              }
            });
          case 3:
            window.location.reload();
          case 4:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
    return 'Just press ok, we only need to send a message to the server.';
  };
  var unloading = false;
  if (options.preventUnload) {
    window.addEventListener('pagehide', unload);
    window.addEventListener('unload', unload);
    window.addEventListener('beforeunload', unload);
  }
  (0, _react2.useEffect)(function () {
    return function () {
      window.removeEventListener('pagehide', unload);
      window.removeEventListener('unload', unload);
      window.removeEventListener('beforeunload', unload);
      if (!subscribed) return;
      if (options.sendUnmount && actualClient) {
        (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
          var cleaned;
          return _regenerator["default"].wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return actualClient.query({
                  query: UNMOUNT_COMPONENT,
                  variables: {
                    key: key
                  },
                  fetchPolicy: 'network-only',
                  context: {
                    headers: {
                      'X-Unique-Id': id,
                      Authorization: session.token ? "Bearer ".concat(session.token) : undefined
                    }
                  }
                });
              case 2:
                cleaned = _context4.sent;
              case 3:
              case "end":
                return _context4.stop();
            }
          }, _callee4);
        }))();
      }
    };
  }, [subscribed]);

  // ssrResponse
  //   ? ssrResponse.data?.renderComponent?.rendered
  //   :
  var inlineData = options !== null && options !== void 0 && options.data && !(queryData !== null && queryData !== void 0 && (_queryData$renderComp11 = queryData.renderComponent) !== null && _queryData$renderComp11 !== void 0 && _queryData$renderComp11.rendered) ? options === null || options === void 0 ? void 0 : options.data : queryData === null || queryData === void 0 ? void 0 : (_queryData$renderComp12 = queryData.renderComponent) === null || _queryData$renderComp12 === void 0 ? void 0 : _queryData$renderComp12.rendered;
  var inlined = inline({
    data: inlineData,
    actualClient: actualClient,
    setLastMutationResult: setLastMutationResult,
    id: id,
    session: session
  });
  var anyError = error || (lastMutationResult === null || lastMutationResult === void 0 ? void 0 : (_lastMutationResult$e = lastMutationResult.errors) === null || _lastMutationResult$e === void 0 ? void 0 : _lastMutationResult$e[0]);
  return [inlined, {
    error: anyError,
    loading: loading,
    refetch: refetch
  }];
};
exports.useComponent = useComponent;
var inline = function inline(_ref9) {
  var data = _ref9.data,
    actualClient = _ref9.actualClient,
    setLastMutationResult = _ref9.setLastMutationResult,
    id = _ref9.id,
    session = _ref9.session;
  var inlined = data;
  if (data !== null && data !== void 0 && data.props) {
    inlined = (0, _utilities.cloneDeep)(inlined);
    var _loop = function _loop() {
      var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
        key = _Object$entries$_i[0],
        val = _Object$entries$_i[1];
      if ((val === null || val === void 0 ? void 0 : val.__typename) === 'FunctionCall') {
        inlined.props[key] = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
          var _len,
            args,
            _key,
            response,
            _args5 = arguments;
          return _regenerator["default"].wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                for (_len = _args5.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = _args5[_key];
                }
                _context5.next = 4;
                return actualClient.mutate({
                  mutation: CALL_FUNCTION,
                  variables: {
                    key: val.component,
                    prop: val.name,
                    args: args
                  },
                  context: {
                    headers: {
                      'X-Unique-Id': id,
                      Authorization: session.token ? "Bearer ".concat(session.token) : undefined
                    }
                  }
                });
              case 4:
                response = _context5.sent;
                setLastMutationResult(response);
                return _context5.abrupt("return", response.data.callFunction);
              case 9:
                _context5.prev = 9;
                _context5.t0 = _context5["catch"](0);
                setLastMutationResult({
                  errors: [_context5.t0]
                });
                throw _context5.t0;
              case 13:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[0, 9]]);
        }));
      }
    };
    for (var _i = 0, _Object$entries = Object.entries(data.props); _i < _Object$entries.length; _i++) {
      _loop();
    }
    var children = inlined.children || [];
    for (var i = 0; i < children.length; i++) {
      inlined.children[i] = inline({
        data: children[i],
        actualClient: actualClient,
        setLastMutationResult: setLastMutationResult,
        id: id,
        session: session
      });
    }
  }
  return inlined;
};
var useServerState = function useServerState(initialValue, options) {
  var _subscriptionData$upd2, _queryData$getState2, _queryData$getState3;
  var key = options.key,
    scope = options.scope,
    client = options.client;
  var _React$useContext2 = _react2["default"].useContext((0, _client.getApolloContext)()),
    _React$useContext2$cl = _React$useContext2.client,
    providedClient = _React$useContext2$cl === void 0 ? null : _React$useContext2$cl;
  var actualClient = providedClient || client;
  var ref = (0, _react2.useRef)(new AbortController());
  if (!actualClient) {
    throw new Error('No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.');
  }
  var _useState7 = (0, _react2.useState)(null),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    optimisticValue = _useState8[0],
    setOptimisticValue = _useState8[1];
  var _useLocalStorage5 = useLocalStorage('id', (0, _uuid.v4)(), {
      cookie: 'x-react-server-id'
    }),
    _useLocalStorage6 = (0, _slicedToArray2["default"])(_useLocalStorage5, 1),
    id = _useLocalStorage6[0];
  var cacheId = "GetData:".concat(key, ":").concat(scope);
  var _useQuery = (0, _react.useQuery)(GET_STATE, {
      client: actualClient,
      variables: {
        key: key,
        scope: scope
      },
      context: {
        headers: {
          'X-Unique-Id': id
        },
        customCacheKey: cacheId
      }
    }),
    queryData = _useQuery.data,
    apolloError = _useQuery.error,
    loading = _useQuery.loading;
  var error = queryData !== null && queryData !== void 0 && queryData.getState && !apolloError ? new _client.ApolloError({
    errorMessage: 'No data'
  }) : apolloError;
  var _useSubscription = (0, _react.useSubscription)(UPDATE_STATE, {
      client: actualClient,
      variables: {
        key: key,
        scope: scope
      }
    }),
    subscriptionData = _useSubscription.data;
  (0, _react2.useEffect)(function () {
    var _subscriptionData$upd;
    if (!(subscriptionData !== null && subscriptionData !== void 0 && (_subscriptionData$upd = subscriptionData.updateState) !== null && _subscriptionData$upd !== void 0 && _subscriptionData$upd.value)) return;
    actualClient.cache.writeQuery({
      query: GET_STATE,
      variables: {
        key: key,
        scope: scope
      },
      data: {
        getState: _objectSpread(_objectSpread({}, queryData === null || queryData === void 0 ? void 0 : queryData.getState), subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.updateState)
      }
    });
  }, [subscriptionData === null || subscriptionData === void 0 ? void 0 : (_subscriptionData$upd2 = subscriptionData.updateState) === null || _subscriptionData$upd2 === void 0 ? void 0 : _subscriptionData$upd2.value]);
  var setValue = (0, _react2.useMemo)(function () {
    return function (value) {
      var actualValue = value;
      if (typeof value === 'function') {
        var _queryData$getState;
        actualValue = value((queryData === null || queryData === void 0 ? void 0 : (_queryData$getState = queryData.getState) === null || _queryData$getState === void 0 ? void 0 : _queryData$getState.value) || initialValue);
      }
      setOptimisticValue(actualValue);
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
        var response;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) switch (_context6.prev = _context6.next) {
            case 0:
              ref.current.abort();
              ref.current = new AbortController();
              response = actualClient.mutate({
                mutation: SET_STATE,
                variables: {
                  key: key,
                  scope: scope,
                  value: actualValue
                },
                context: {
                  fetchOptions: {
                    signal: ref.current.signal
                  }
                }
              });
              _context6.next = 5;
              return response;
            case 5:
              if (!ref.current.signal.aborted) {
                _context6.next = 7;
                break;
              }
              return _context6.abrupt("return");
            case 7:
              setTimeout(setOptimisticValue, 0, null);
            case 8:
            case "end":
              return _context6.stop();
          }
        }, _callee6);
      }))();
    };
  }, [key, scope, actualClient, queryData === null || queryData === void 0 ? void 0 : (_queryData$getState2 = queryData.getState) === null || _queryData$getState2 === void 0 ? void 0 : _queryData$getState2.value]);
  if (optimisticValue !== null) {
    return [optimisticValue, setValue, {
      error: error,
      loading: loading
    }];
  }
  return [(queryData === null || queryData === void 0 ? void 0 : (_queryData$getState3 = queryData.getState) === null || _queryData$getState3 === void 0 ? void 0 : _queryData$getState3.value) || initialValue, setValue, {
    error: error,
    loading: loading
  }];
};
exports.useServerState = useServerState;