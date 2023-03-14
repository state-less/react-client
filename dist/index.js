"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useServerState = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _client = require("@apollo/client");
var _react = require("@apollo/client/react");
var _react2 = require("react");
var _templateObject, _templateObject2, _templateObject3;
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var UPDATE_STATE = (0, _client.gql)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  subscription MyQuery($key: ID!, $scope: String!) {\n    updateState(key: $key, scope: $scope) {\n      id\n      value\n    }\n  }\n"])));
var STATE = (0, _client.gql)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  query MyQuery($key: ID!, $scope: String!) {\n    getState(key: $key, scope: $scope) {\n      id\n      value\n    }\n  }\n"])));
var SET_STATE = (0, _client.gql)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  mutation MyMutation($key: ID!, $scope: String!, $value: JSON) {\n    setState(key: $key, scope: $scope, value: $value) {\n      key\n      id\n      value\n      scope\n    }\n  }\n"])));
var useServerState = function useServerState(initialValue, options) {
  var _subscriptionData$upd, _queryData$getState;
  var key = options.key,
    scope = options.scope,
    client = options.client,
    initialServerValue = options.initialValue;
  var _useState = (0, _react2.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    optimisticValue = _useState2[0],
    setOptimisticValue = _useState2[1];
  var _useQuery = (0, _react.useQuery)(STATE, {
      client: client,
      variables: {
        key: key,
        scope: scope
      }
    }),
    queryData = _useQuery.data;
  var _useSubscription = (0, _react.useSubscription)(UPDATE_STATE, {
      client: client,
      variables: {
        key: key,
        scope: scope
      }
    }),
    subscriptionData = _useSubscription.data;
  (0, _react2.useEffect)(function () {
    if (!client) {
      console.warn('No client provided to useServerState. Check your provider.');
      return;
    }
    setOptimisticValue(null);
    client.cache.modify({
      fields: {
        getState: function getState() {
          return _objectSpread(_objectSpread({}, queryData.getState), subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.updateState);
        }
      }
    });
  }, [subscriptionData === null || subscriptionData === void 0 ? void 0 : (_subscriptionData$upd = subscriptionData.updateState) === null || _subscriptionData$upd === void 0 ? void 0 : _subscriptionData$upd.value]);
  var setValue = (0, _react2.useMemo)(function () {
    return function (value) {
      if (!client) {
        console.warn('No client provided to useServerState. Check your provider.');
        setOptimisticValue(value);
        return;
      }
      setOptimisticValue(value);
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              client.mutate({
                mutation: SET_STATE,
                variables: {
                  key: key,
                  scope: scope,
                  value: value
                }
              });
              setOptimisticValue(null);
            case 2:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }))();
    };
  }, [key, scope, client]);
  if (optimisticValue !== null) {
    return [optimisticValue, setValue];
  }
  return [(queryData === null || queryData === void 0 ? void 0 : (_queryData$getState = queryData.getState) === null || _queryData$getState === void 0 ? void 0 : _queryData$getState.value) || initialValue, setValue];
};
exports.useServerState = useServerState;