"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useServerState = exports.useComponent = exports.UPDATE_STATE = exports.UPDATE_COMPONENT = exports.SET_STATE = exports.RENDER_COMPONENT = exports.GET_STATE = exports.CALL_FUNCTION = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));
var _client = require("@apollo/client");
var _react = require("@apollo/client/react");
var _react2 = _interopRequireWildcard(require("react"));
var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var RENDER_COMPONENT = (0, _client.gql)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2["default"])(["\n  query MyQuery($key: ID!, $props: JSON) {\n    renderComponent(key: $key, props: $props) {\n      rendered {\n        ... on ServerSideProps {\n          props\n          children\n        }\n        __typename\n        ... on Server {\n          version\n          uptime\n          platform\n          components: children {\n            __typename\n            ... on ServerSideProps {\n              props\n              children\n            }\n          }\n        }\n      }\n    }\n  }\n"])));
exports.RENDER_COMPONENT = RENDER_COMPONENT;
var UPDATE_STATE = (0, _client.gql)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2["default"])(["\n  subscription MyQuery($key: ID!, $scope: String!) {\n    updateState(key: $key, scope: $scope) {\n      id\n      value\n    }\n  }\n"])));
exports.UPDATE_STATE = UPDATE_STATE;
var UPDATE_COMPONENT = (0, _client.gql)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2["default"])(["\n  subscription MyQuery($key: ID!, $scope: String!) {\n    updateComponent(key: $key, scope: $scope) {\n      rendered {\n        ... on ServerSideProps {\n          props\n          children\n        }\n        __typename\n        ... on Server {\n          version\n          uptime\n          platform\n          components: children {\n            __typename\n            ... on ServerSideProps {\n              props\n              children\n            }\n          }\n        }\n      }\n    }\n  }\n"])));
exports.UPDATE_COMPONENT = UPDATE_COMPONENT;
var GET_STATE = (0, _client.gql)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2["default"])(["\n  query MyQuery($key: ID!, $scope: String!) {\n    getState(key: $key, scope: $scope) {\n      id\n      value\n    }\n  }\n"])));
exports.GET_STATE = GET_STATE;
var SET_STATE = (0, _client.gql)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2["default"])(["\n  mutation MyMutation($key: ID!, $scope: String!, $value: JSON) {\n    setState(key: $key, scope: $scope, value: $value) {\n      key\n      id\n      value\n      scope\n    }\n  }\n"])));
exports.SET_STATE = SET_STATE;
var CALL_FUNCTION = (0, _client.gql)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2["default"])(["\n  mutation MyMutation($key: ID!, $prop: String!, $args: JSON) {\n    callFunction(key: $key, prop: $prop, args: $args)\n  }\n"])));
exports.CALL_FUNCTION = CALL_FUNCTION;
var useComponent = function useComponent(key, options) {
  var _queryData$renderComp5, _queryData$renderComp6, _queryData$renderComp7;
  var client = options.client;
  var _React$useContext = _react2["default"].useContext((0, _client.getApolloContext)()),
    _React$useContext$cli = _React$useContext.client,
    providedClient = _React$useContext$cli === void 0 ? null : _React$useContext$cli;
  var actualClient = client || providedClient;
  if (!actualClient) {
    throw new Error('No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.');
  }
  var _useQuery = (0, _react.useQuery)(RENDER_COMPONENT, {
      client: actualClient,
      variables: {
        key: key,
        props: options.props
      }
    }),
    queryData = _useQuery.data,
    error = _useQuery.error,
    loading = _useQuery.loading;
  (0, _react2.useEffect)(function () {
    var _queryData$renderComp, _queryData$renderComp2;
    if (!(queryData !== null && queryData !== void 0 && (_queryData$renderComp = queryData.renderComponent) !== null && _queryData$renderComp !== void 0 && (_queryData$renderComp2 = _queryData$renderComp.rendered) !== null && _queryData$renderComp2 !== void 0 && _queryData$renderComp2.key)) return;
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
                scope: 'global'
              }
            });
          case 2:
            sub = _context.sent;
            console.log('SUBSCRIBED', sub);
            sub.subscribe(function (a) {
              console.log('OBSERVED', a);
            });
          case 5:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }, [queryData === null || queryData === void 0 ? void 0 : (_queryData$renderComp5 = queryData.renderComponent) === null || _queryData$renderComp5 === void 0 ? void 0 : (_queryData$renderComp6 = _queryData$renderComp5.rendered) === null || _queryData$renderComp6 === void 0 ? void 0 : _queryData$renderComp6.key]);
  var inlined = inlineFunctions((queryData === null || queryData === void 0 ? void 0 : (_queryData$renderComp7 = queryData.renderComponent) === null || _queryData$renderComp7 === void 0 ? void 0 : _queryData$renderComp7.rendered) || {
    props: {},
    children: []
  }, actualClient);
  return [inlined, {
    error: error,
    loading: loading
  }];
};
exports.useComponent = useComponent;
var inlineFunctions = function inlineFunctions(obj, actualClient) {
  var inlined = JSON.parse(JSON.stringify(obj));
  var _loop = function _loop() {
    var _Object$entries$_i = (0, _slicedToArray2["default"])(_Object$entries[_i], 2),
      key = _Object$entries$_i[0],
      val = _Object$entries$_i[1];
    if (val.__typename === 'FunctionCall') {
      inlined.props[key] = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
        var _len,
          args,
          _key,
          _args2 = arguments;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              console.log('Hello from the client!');
              for (_len = _args2.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = _args2[_key];
              }
              _context2.next = 4;
              return actualClient.mutate({
                mutation: CALL_FUNCTION,
                variables: {
                  key: val.component,
                  prop: val.name,
                  args: args
                }
              });
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
    }
  };
  for (var _i = 0, _Object$entries = Object.entries(obj.props); _i < _Object$entries.length; _i++) {
    _loop();
  }
  return inlined;
};
var useServerState = function useServerState(initialValue, options) {
  var _subscriptionData$upd, _queryData$getState;
  var key = options.key,
    scope = options.scope,
    client = options.client;
  var _React$useContext2 = _react2["default"].useContext((0, _client.getApolloContext)()),
    _React$useContext2$cl = _React$useContext2.client,
    providedClient = _React$useContext2$cl === void 0 ? null : _React$useContext2$cl;
  var actualClient = providedClient || client;
  if (!actualClient) {
    throw new Error('No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.');
  }
  var _useState = (0, _react2.useState)(null),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    optimisticValue = _useState2[0],
    setOptimisticValue = _useState2[1];
  var _useQuery2 = (0, _react.useQuery)(GET_STATE, {
      client: actualClient,
      variables: {
        key: key,
        scope: scope
      }
    }),
    queryData = _useQuery2.data,
    apolloError = _useQuery2.error,
    loading = _useQuery2.loading;
  console.log('Err', queryData, apolloError);
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
    actualClient.cache.modify({
      fields: {
        getState: function getState() {
          return _objectSpread(_objectSpread({}, queryData.getState), subscriptionData === null || subscriptionData === void 0 ? void 0 : subscriptionData.updateState);
        }
      }
    });
    setTimeout(setOptimisticValue, 0, null);
  }, [subscriptionData === null || subscriptionData === void 0 ? void 0 : (_subscriptionData$upd = subscriptionData.updateState) === null || _subscriptionData$upd === void 0 ? void 0 : _subscriptionData$upd.value]);
  var setValue = (0, _react2.useMemo)(function () {
    return function (value) {
      setOptimisticValue(value);
      (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return actualClient.mutate({
                mutation: SET_STATE,
                variables: {
                  key: key,
                  scope: scope,
                  value: value
                }
              });
            case 2:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }))();
    };
  }, [key, scope, actualClient]);
  if (optimisticValue !== null) {
    return [optimisticValue, setValue, {
      error: error,
      loading: loading
    }];
  }
  return [(queryData === null || queryData === void 0 ? void 0 : (_queryData$getState = queryData.getState) === null || _queryData$getState === void 0 ? void 0 : _queryData$getState.value) || initialValue, setValue, {
    error: error,
    loading: loading
  }];
};
exports.useServerState = useServerState;