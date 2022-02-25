"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SCOPE_GLOBAL = exports.SCOPE_CLIENT = exports.EVENT_USE_STATE = exports.EVENT_USE_COMPONENT = exports.EVENT_SET_STATE = exports.EVENT_EXECUTE_ACTION = exports.EVENT_ERROR = exports.EVENT_DELIM = exports.EVENT_CREATE_STATE = exports.DEFAULT_SCOPE = void 0;
var SCOPE_CLIENT = '$client';
exports.SCOPE_CLIENT = SCOPE_CLIENT;
var SCOPE_GLOBAL = 'global';
exports.SCOPE_GLOBAL = SCOPE_GLOBAL;
var EVENT_DELIM = ':';
exports.EVENT_DELIM = EVENT_DELIM;
var EVENT_SET_STATE = 'setState';
exports.EVENT_SET_STATE = EVENT_SET_STATE;
var EVENT_USE_STATE = 'useState';
exports.EVENT_USE_STATE = EVENT_USE_STATE;
var EVENT_CREATE_STATE = 'createState';
exports.EVENT_CREATE_STATE = EVENT_CREATE_STATE;
var EVENT_ERROR = 'error';
exports.EVENT_ERROR = EVENT_ERROR;
var EVENT_USE_COMPONENT = 'render';
exports.EVENT_USE_COMPONENT = EVENT_USE_COMPONENT;
var EVENT_EXECUTE_ACTION = 'executeAction';
exports.EVENT_EXECUTE_ACTION = EVENT_EXECUTE_ACTION;
var DEFAULT_SCOPE = SCOPE_CLIENT;
exports.DEFAULT_SCOPE = DEFAULT_SCOPE;