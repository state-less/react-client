"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.web3Context = exports.injected = exports.Web3UtilProvider = exports.Web3Provider = void 0;

var _react = _interopRequireWildcard(require("react"));

var _core = require("@web3-react/core");

var _providers = require("@ethersproject/providers");

var _injectedConnector = require("@web3-react/injected-connector");

var _web2 = _interopRequireDefault(require("web3"));

var _jsxRuntime = require("react/jsx-runtime");

var _excluded = ["activate", "account", "active", "error"],
    _excluded2 = ["children"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var injected = new _injectedConnector.InjectedConnector({
  supportedChainIds: [56, 1337]
});
exports.injected = injected;

function getLibrary(provider, connector) {
  return new _providers.Web3Provider(provider); // this will vary according to whether you use e.g. ethers or web3.js
}

var web3Context = (0, _react.createContext)();
exports.web3Context = web3Context;

var Web3UtilProvider = function Web3UtilProvider(_ref) {
  var children = _ref.children,
      _ref$autoActivate = _ref.autoActivate,
      autoActivate = _ref$autoActivate === void 0 ? true : _ref$autoActivate;
  var web3React = (0, _core.useWeb3React)();

  var activate = web3React.activate,
      account = web3React.account,
      active = web3React.active,
      error = web3React.error,
      rest = _objectWithoutProperties(web3React, _excluded);

  var _useState = (0, _react.useState)(null),
      _useState2 = _slicedToArray(_useState, 2),
      web3 = _useState2[0],
      setWeb3 = _useState2[1];

  var activateInjected = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", activate(injected));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function activateInjected() {
      return _ref2.apply(this, arguments);
    };
  }();

  (0, _react.useEffect)(function () {
    if (!autoActivate) return;

    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return activate(injected);

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }, []);
  (0, _react.useEffect)(function () {
    if (account) {
      var _web3React$library;

      var _web3 = new _web2.default(web3React === null || web3React === void 0 ? void 0 : (_web3React$library = web3React.library) === null || _web3React$library === void 0 ? void 0 : _web3React$library.provider);

      setWeb3(_web3);
    }
  }, [account]);
  /**
   * 
   * @param {*} web3 - The web3 instance
   * @param {*} message - The message to sign
   * @param {*} account - The account to sign with
   * @returns - The signature
   */

  function sign(_x, _x2) {
    return _sign.apply(this, arguments);
  }
  /**
   * Recovers the account from a signed message
   * @param {*} web3 
   * @param {*} message 
   * @param {*} sig 
   */


  function _sign() {
    _sign = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(message, account) {
      var res, _web3React$library2, _web;

      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              if (!(!web3 && !account)) {
                _context3.next = 2;
                break;
              }

              throw new Error('Web 3 not yet loaded, please connect an account');

            case 2:
              if (!account) {
                _context3.next = 9;
                break;
              }

              _web = new _web2.default(web3React === null || web3React === void 0 ? void 0 : (_web3React$library2 = web3React.library) === null || _web3React$library2 === void 0 ? void 0 : _web3React$library2.provider);
              _context3.next = 6;
              return _web.eth.personal.sign(message, account);

            case 6:
              res = _context3.sent;
              _context3.next = 12;
              break;

            case 9:
              _context3.next = 11;
              return web3.eth.personal.sign(message, account);

            case 11:
              res = _context3.sent;

            case 12:
              return _context3.abrupt("return", res);

            case 13:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));
    return _sign.apply(this, arguments);
  }

  function recover(_x3, _x4) {
    return _recover.apply(this, arguments);
  }
  /**
   * Verifies an account by signing a message.
   * @param *{} web3 
   * @param {*} account  The account to verify
   * @param {*} message  - Optional message to sign.
   * @returns 
   */


  function _recover() {
    _recover = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(message, sig) {
      var res;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (web3) {
                _context4.next = 2;
                break;
              }

              throw new Error('Web 3 not yet loaded, please connect an account');

            case 2:
              _context4.next = 4;
              return web3.eth.personal.ecRecover(message, sig);

            case 4:
              res = _context4.sent;
              return _context4.abrupt("return", res);

            case 6:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));
    return _recover.apply(this, arguments);
  }

  function verify(_x5) {
    return _verify.apply(this, arguments);
  }

  function _verify() {
    _verify = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(account) {
      var message,
          sig,
          acc,
          _args5 = arguments;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              message = _args5.length > 1 && _args5[1] !== undefined ? _args5[1] : 'Please verify your Identity by signing this message.';

              if (web3) {
                _context5.next = 3;
                break;
              }

              throw new Error('Web 3 not yet loaded, please connect an account');

            case 3:
              _context5.next = 5;
              return sign(message, account);

            case 5:
              sig = _context5.sent;
              _context5.next = 8;
              return recover(message, sig);

            case 8:
              acc = _context5.sent;
              return _context5.abrupt("return", acc.toLowerCase() === account.toLowerCase());

            case 10:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));
    return _verify.apply(this, arguments);
  }

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(web3Context.Provider, {
    value: _objectSpread({
      activateInjected: activateInjected,
      sign: sign,
      recover: recover,
      verify: verify,
      active: active,
      account: account,
      error: error
    }, rest),
    children: children
  });
};

exports.Web3UtilProvider = Web3UtilProvider;

var Web3Provider = function Web3Provider(_ref4) {
  var children = _ref4.children,
      rest = _objectWithoutProperties(_ref4, _excluded2);

  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_core.Web3ReactProvider, {
    getLibrary: getLibrary,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(Web3UtilProvider, _objectSpread(_objectSpread({}, rest), {}, {
      children: children
    }))
  });
};

exports.Web3Provider = Web3Provider;