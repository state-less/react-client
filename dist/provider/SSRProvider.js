"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ssrContext = exports.SSRProvider = void 0;
var _react = require("react");
var ssrContext = /*#__PURE__*/(0, _react.createContext)({
  req: null
});
exports.ssrContext = ssrContext;
var SSRProvider = function SSRProvider(_ref) {
  var req = _ref.req,
    children = _ref.children;
  return /*#__PURE__*/React.createElement(ssrContext.Provider, {
    value: {
      req: req
    }
  }, children);
};
exports.SSRProvider = SSRProvider;