"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.context = void 0;

var _react = require("react");

var context = (0, _react.createContext)({
  socket: null,
  sockets: [],
  secOpen: [],
  open: false,
  allOpen: false,
  headers: {},
  setHeaders: function setHeaders() {},
  identity: null,
  setIdentity: function setIdentity() {},
  error: null
});
exports.context = context;