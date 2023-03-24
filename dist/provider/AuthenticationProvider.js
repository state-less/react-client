"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authContext = exports.AuthProvider = exports.AUTHENTICATE = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _client = require("@apollo/client");
var _react = require("react");
var _ = require("..");
var _templateObject;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var authContext = /*#__PURE__*/(0, _react.createContext)({
  id: null,
  signed: null,
  authenticate: null
});
exports.authContext = authContext;
var AUTHENTICATE = (0, _client.gql)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  mutation MyMutation($strategy: String!, $data: JSON!) {\n    setState(strategy: $strategy, data: $data) {\n      id\n      signed\n    }\n  }\n"])));
exports.AUTHENTICATE = AUTHENTICATE;
var AuthProvider = function AuthProvider(_ref) {
  var children = _ref.children,
    client = _ref.client;
  var context = (0, _client.getApolloContext)();
  var _useContext = (0, _react.useContext)(context),
    apolloClient = _useContext.client;
  var actualClient = client || apolloClient;
  var _useLocalStorage = (0, _.useLocalStorage)('session', {
      id: null,
      signed: null
    }),
    _useLocalStorage2 = (0, _slicedToArray2["default"])(_useLocalStorage, 2),
    auth = _useLocalStorage2[0],
    setAuth = _useLocalStorage2[1];
  var authenticate = /*#__PURE__*/function () {
    var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(_ref2) {
      var strategy, data, _yield$actualClient$m, authenticate;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            strategy = _ref2.strategy, data = _ref2.data;
            _context.next = 3;
            return actualClient.mutate({
              mutation: AUTHENTICATE,
              variables: {
                strategy: strategy,
                data: data
              }
            });
          case 3:
            _yield$actualClient$m = _context.sent;
            authenticate = _yield$actualClient$m.data.authenticate;
            setAuth(authenticate);
          case 6:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return function authenticate(_x) {
      return _ref3.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement(authContext.Provider, {
    value: _objectSpread({
      authenticate: authenticate
    }, auth)
  });
};
exports.AuthProvider = AuthProvider;