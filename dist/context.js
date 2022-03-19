"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.context = void 0;

var _react = require("react");

var _util = require("./lib/util");

var context = (0, _react.createContext)({
  sockets: {},
  open: false,
  headers: {},
  setHeaders: _util.noopSync,
  identity: null,
  setIdentity: _util.noopSync,
  error: null
});
exports.context = context;