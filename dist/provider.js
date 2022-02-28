"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useClientContext = exports.useAuth = exports.Provider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _jotai = require("jotai");

var _context6 = require("./context");

var _socket = require("./lib/util/socket");

var _logger = require("./lib/logger");

var _Web = require("./Web3");

var _jotai2 = require("./hooks/jotai");

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _reconnectingWebsocket = _interopRequireDefault(require("reconnecting-websocket"));

var _jsxRuntime = require("react/jsx-runtime");

var _excluded = ["Authorization"];

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var useClientContext = function useClientContext() {
  var internalCtx = (0, _react.useContext)(_context6.context);
  var web3Ctx = (0, _react.useContext)(_Web.web3Context);
  return _objectSpread(_objectSpread({}, internalCtx), web3Ctx);
};

exports.useClientContext = useClientContext;
var compId;

var useNoopStrat = function useNoopStrat() {
  return {
    authenticate: function authenticate() {
      throw new Error('Cannot call authenticate without a strategy.');
    },
    logout: function logout() {
      console.warn('Performing logout without strategy');
    },
    id: null,
    strategy: null
  };
};

var useAuth = function useAuth() {
  var useStrategy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : useNoopStrat;
  var auto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _useContext = (0, _react.useContext)(_context6.context),
      open = _useContext.open,
      socket = _useContext.socket,
      headers = _useContext.headers,
      setHeaders = _useContext.setHeaders,
      setIdentity = _useContext.setIdentity,
      identity = _useContext.identity;

  var _useStrategy = useStrategy(),
      auth = _useStrategy.authenticate,
      deauth = _useStrategy.logout,
      id = _useStrategy.id,
      strategy = _useStrategy.strategy;

  var _useState = (0, _react.useState)(false),
      _useState2 = _slicedToArray(_useState, 2),
      authed = _useState2[0],
      setHasAuthed = _useState2[1];

  (0, _react.useEffect)(function () {
    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _challenge, newHeaders;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(open && !authed && auto)) {
                _context.next = 5;
                break;
              }

              _context.next = 3;
              return (0, _socket.request)(socket, {
                action: 'auth',
                phase: 'challenge',
                headers: headers
              });

            case 3:
              _challenge = _context.sent;

              if (_challenge.address) {
                setHasAuthed(true);
              } else {
                newHeaders = _objectSpread({}, headers);
                delete newHeaders.Authorization;
                debugger;
                setHeaders(newHeaders);
                setIdentity(null);
              }

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }, [open, authed]);
  (0, _react.useEffect)(function () {
    if (!(headers !== null && headers !== void 0 && headers.Authorization)) return;

    var identity = _jsonwebtoken.default.decode(headers.Authorization.split(' ')[1]);

    var timeValid = identity.exp * 1000 - +new Date();
    var to = setTimeout(function () {
      _logger.orgLogger.info(_templateObject || (_templateObject = _taggedTemplateLiteral(["\"JWT Expired. Logging out."])));

      logout();
    }, timeValid);
    setIdentity(identity);
    return function () {
      clearTimeout(to);
    };
  }, [headers === null || headers === void 0 ? void 0 : headers.Authorization]);

  function authenticate() {
    return _authenticate.apply(this, arguments);
  }

  function _authenticate() {
    _authenticate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      var challenge,
          _len,
          args,
          _key,
          data,
          response,
          newHeaders,
          _args3 = arguments;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return (0, _socket.request)(socket, {
                action: 'auth',
                phase: 'challenge',
                strategy: strategy,
                headers: headers
              });

            case 2:
              challenge = _context3.sent;

              for (_len = _args3.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = _args3[_key];
              }

              _context3.next = 6;
              return auth.apply(this, [challenge].concat(args));

            case 6:
              data = _context3.sent;

              if (!data.success) {
                _context3.next = 19;
                break;
              }

              _context3.prev = 8;
              _context3.next = 11;
              return (0, _socket.request)(socket, _objectSpread({
                action: 'auth',
                phase: 'response'
              }, data));

            case 11:
              response = _context3.sent;

              if (response) {
                setHasAuthed(true);
                setHeaders(_objectSpread(_objectSpread({}, headers), {}, {
                  Authorization: "Bearer ".concat(response)
                }));
              } else {
                newHeaders = _objectSpread({}, headers);
                delete newHeaders.Authorization;
                setHeaders(newHeaders);
                setIdentity(null);
              }

              return _context3.abrupt("return", response);

            case 16:
              _context3.prev = 16;
              _context3.t0 = _context3["catch"](8);
              throw _context3.t0;

            case 19:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this, [[8, 16]]);
    }));
    return _authenticate.apply(this, arguments);
  }

  function register(_x) {
    return _register.apply(this, arguments);
  }

  function _register() {
    _register = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(strategy) {
      var response;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return (0, _socket.request)(socket, {
                action: 'auth',
                phase: 'register',
                strategy: strategy,
                headers: headers
              });

            case 2:
              response = _context4.sent;

              if (!response) {
                _context4.next = 13;
                break;
              }

              _context4.prev = 4;
              setHeaders(_objectSpread(_objectSpread({}, headers), {}, {
                Authorization: "Bearer ".concat(response)
              }));
              setHasAuthed(true);
              return _context4.abrupt("return", response);

            case 10:
              _context4.prev = 10;
              _context4.t0 = _context4["catch"](4);
              throw _context4.t0;

            case 13:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[4, 10]]);
    }));
    return _register.apply(this, arguments);
  }

  function logout() {
    return _logout.apply(this, arguments);
  }

  function _logout() {
    _logout = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
      var Authorization, rest;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              Authorization = headers.Authorization, rest = _objectWithoutProperties(headers, _excluded);
              _context5.next = 3;
              return deauth();

            case 3:
              setHeaders(rest);
              setIdentity(null);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _logout.apply(this, arguments);
  }

  (0, _react.useEffect)(function () {
    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(id && compId && compId !== id && authed)) {
                _context2.next = 4;
                break;
              }

              compId = id;
              _context2.next = 4;
              return logout();

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))(); // return () => {
    //     compId = null;
    // }

  }, [id]);
  return {
    authenticate: authenticate,
    register: register,
    logout: logout
  };
};

exports.useAuth = useAuth;
var headerAtom = (0, _jotai.atom)({});

var SocketManager = function SocketManager(url) {
  var ws = new WebSocket(url);
  ws.addEventListener('open', function open() {});
  ws.addEventListener('close', function open() {});
};

var MainProvider = function MainProvider(props) {
  var _props$urls = props.urls,
      urls = _props$urls === void 0 ? [] : _props$urls,
      url = props.url,
      _props$headers = props.headers,
      staticHeaders = _props$headers === void 0 ? {} : _props$headers,
      useAtom = props.useAtom;

  var _useState3 = (0, _react.useState)(false),
      _useState4 = _slicedToArray(_useState3, 2),
      open = _useState4[0],
      setOpen = _useState4[1];

  var _useLocalStorage = (0, _jotai2.useLocalStorage)('headers', headerAtom, staticHeaders),
      _useLocalStorage2 = _slicedToArray(_useLocalStorage, 2),
      headers = _useLocalStorage2[0],
      setHeaders = _useLocalStorage2[1];

  var _useState5 = (0, _react.useState)(urls.map(function () {
    return false;
  })),
      _useState6 = _slicedToArray(_useState5, 2),
      secOpen = _useState6[0],
      setSecOpen = _useState6[1];

  var _useState7 = (0, _react.useState)(null),
      _useState8 = _slicedToArray(_useState7, 2),
      error = _useState8[0],
      setError = _useState8[1];

  var _useState9 = (0, _react.useState)(null),
      _useState10 = _slicedToArray(_useState9, 2),
      identity = _useState10[0],
      setIdentity = _useState10[1];

  var allOpen = secOpen.reduce(function (all, cur) {
    return all && cur;
  }, open);
  if (!url) throw new Error("Missing property 'url' in Provider props.");
  var socket = (0, _react.useMemo)(function () {
    if (typeof window === 'undefined' || typeof _reconnectingWebsocket.default === 'undefined') return;
    var ws = new _reconnectingWebsocket.default(url);
    (0, _socket.setupWsHeartbeat)(ws);
    ws.addEventListener('open', function () {
      _logger.orgLogger.warning(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["Socket connection initialized."])));

      setOpen(true);
    });
    ws.addEventListener('close', function () {
      _logger.orgLogger.warning(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["Socket connection lost. Reconnecting."])));

      setOpen(false);
    });
    return ws;
  }, [url, typeof window === "undefined" ? "undefined" : _typeof(window)]);
  var sockets = (0, _react.useMemo)(function () {
    // return urls.map((url, i) => {
    //     if (
    //         typeof window === 'undefined' ||
    //         typeof ReconnectingWebsocket === 'undefined'
    //     )
    //         return;
    //     const ws = new ReconnectingWebsocket(url);
    //     ws.addEventListener('open', function open() {
    //         console.log('connected');
    //         // ws.send(JSON.stringify({"action" : "render" , "message" : "Hello everyone"}));
    //         // ws.send(JSON.stringify({"action" : "useState" ,"key":"votes", "scope":"base"}));
    //         // console.log ("sent")
    //         // setOpen(true);
    //         setSecOpen((secOpen) => {
    //             const updated = [...secOpen];
    //             updated[i] = true;
    //             setSecOpen(updated);
    //         });
    //     });
    //     ws.addEventListener('message',  (event) => {
    //         const data = await consume(event);
    //     });
    //     return ws;
    // });
    return [];
  }, [typeof window === "undefined" ? "undefined" : _typeof(window)]);
  (0, _react.useEffect)(function () {
    if (!socket) return;
    (0, _socket.on)(socket, 'error', function () {
      var message = _logger.orgLogger.error(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["Error connecting to socket ", "."])), url);

      setError(message);
    });
  }, [socket]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_context6.context.Provider, {
    value: {
      setIdentity: setIdentity,
      identity: identity,
      setHeaders: setHeaders,
      socket: socket,
      sockets: sockets,
      open: open,
      secOpen: secOpen,
      allOpen: allOpen,
      headers: headers,
      error: error
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Web.Web3Provider, {
      children: props.children
    })
  });
};

var Provider = function Provider(props) {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_jotai.Provider, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(MainProvider, _objectSpread({}, props))
  });
};

exports.Provider = Provider;