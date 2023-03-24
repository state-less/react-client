"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authContext = exports.AuthProvider = exports.AUTHENTICATE = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _client = require("@apollo/client");
var _react = _interopRequireWildcard(require("react"));
var _ = require("..");
var _instances = require("../lib/instances");
var _templateObject;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var authContext = /*#__PURE__*/(0, _react.createContext)({
  session: _instances.initialSession,
  authenticate: null
});
exports.authContext = authContext;
var AUTHENTICATE = (0, _client.gql)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  mutation MyMutation($strategy: String!, $data: JSON!) {\n    authenticate(strategy: $strategy, data: $data) {\n      id\n      strategy\n      strategies\n      token\n    }\n  }\n"])));
exports.AUTHENTICATE = AUTHENTICATE;
var AuthProvider = function AuthProvider(_ref) {
  var children = _ref.children,
    client = _ref.client;
  var context = (0, _client.getApolloContext)();
  var _useContext = (0, _react.useContext)(context),
    apolloClient = _useContext.client;
  var actualClient = client || apolloClient;
  var _useLocalStorage = (0, _.useLocalStorage)('session', _instances.initialSession),
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
  return /*#__PURE__*/_react["default"].createElement(authContext.Provider, {
    value: {
      authenticate: authenticate,
      session: auth
    }
  }, children);
};
exports.AuthProvider = AuthProvider;