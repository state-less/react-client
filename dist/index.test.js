"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _react = _interopRequireDefault(require("react"));
var _ = require(".");
var _testing = require("@apollo/client/testing");
var _react2 = require("@testing-library/react");
require("@testing-library/jest-dom/extend-expect");
var _testUtils = require("react-dom/test-utils");
var mocks = [{
  request: {
    query: _.SET_STATE,
    variables: {
      key: 'hello-world',
      scope: 'global',
      value: 'Hello World'
    }
  },
  result: {
    data: {
      setState: {
        id: '1',
        value: 'Hello World'
      }
    }
  }
}, {
  request: {
    query: _.GET_STATE,
    variables: {
      key: 'hello-world',
      scope: 'global'
    }
  },
  result: {
    data: {
      getState: {
        id: '1',
        value: 'Hello World'
      }
    }
  }
}, {
  request: {
    query: _.UPDATE_STATE,
    variables: {
      key: 'hello-world',
      scope: 'global'
    }
  },
  result: {
    data: {
      updateState: {
        id: '1',
        value: 'Hello World'
      }
    }
  }
}];
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
  it('throws an error if no client is found', function () {
    expect(function () {
      return (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(Mock, null));
    }).toThrow('No Apollo Client found. Wrap your application in an ApolloProvider or provide a Client in the options.');
  });
  it('renders without crashing', function () {
    (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_testing.MockedProvider, {
      mocks: mocks
    }, /*#__PURE__*/_react["default"].createElement(Mock, null)));
  });
  it('renders the initial state value', function () {
    var _render = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_testing.MockedProvider, {
        mocks: mocks
      }, /*#__PURE__*/_react["default"].createElement(Mock, null))),
      getByText = _render.getByText;
    expect(getByText(initialValue)).toBeInTheDocument();
  });
  it('updates the state value', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var _render2, getByText, getByTestId;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _render2 = (0, _react2.render)( /*#__PURE__*/_react["default"].createElement(_testing.MockedProvider, {
            mocks: mocks
          }, /*#__PURE__*/_react["default"].createElement(SetValueMock, null))), getByText = _render2.getByText, getByTestId = _render2.getByTestId;
          _context.t0 = expect;
          _context.next = 4;
          return getByText(initialValue);
        case 4:
          _context.t1 = _context.sent;
          (0, _context.t0)(_context.t1).toBeInTheDocument();
          (0, _testUtils.act)(function () {
            getByTestId('button').click();
          });
          _context.t2 = expect;
          _context.next = 10;
          return getByText('Hello World');
        case 10:
          _context.t3 = _context.sent;
          (0, _context.t2)(_context.t3).toBeInTheDocument();
        case 12:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
});