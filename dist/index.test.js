"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _ = require(".");
var _testing = require("@apollo/client/testing");
var _react2 = require("@testing-library/react");
require("@testing-library/jest-dom/extend-expect");
var initialValue = 'Hello World';
var Mock = function Mock() {
  var _useServerState = (0, _.useServerState)(initialValue, {
      key: 'hello-world',
      scope: 'global'
    }),
    _useServerState2 = (0, _slicedToArray2["default"])(_useServerState, 1),
    value = _useServerState2[0];
  return /*#__PURE__*/_react["default"].createElement("div", null, value);
};
var SetValueMock = function SetValueMock() {
  var _useServerState3 = (0, _.useServerState)(initialValue, {
      key: 'hello-world',
      scope: 'global'
    }),
    _useServerState4 = (0, _slicedToArray2["default"])(_useServerState3, 2),
    value = _useServerState4[0],
    setValue = _useServerState4[1];
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    id: "value"
  }, value), /*#__PURE__*/_react["default"].createElement("button", {
    "data-testid": "button",
    onClick: function onClick() {
      return setValue('Hello World');
    }
  }, "Click"));
};
describe('React Client', function () {
  it('throws an error if no client is passed', function () {
    expect(function () {
      return (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(Mock, null));
    }).toThrow('No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.');
  });
  it('renders without crashing', function () {
    (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_testing.MockedProvider, null, /*#__PURE__*/_react["default"].createElement(Mock, null)));
  });
  it('renders the initial state value', function () {
    var _render = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_testing.MockedProvider, null, /*#__PURE__*/_react["default"].createElement(Mock, null))),
      getByText = _render.getByText;
    expect(getByText(initialValue)).toBeInTheDocument();
  });
  it('updates the state value', function () {
    var _render2 = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_testing.MockedProvider, null, /*#__PURE__*/_react["default"].createElement(SetValueMock, null))),
      getByText = _render2.getByText,
      getByTestId = _render2.getByTestId;
    expect(getByText(initialValue)).toBeInTheDocument();
    getByTestId('button').click();
    expect(getByText('Hello World')).toBeInTheDocument();
  });
});