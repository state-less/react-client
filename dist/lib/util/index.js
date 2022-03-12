"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateMid = exports.noopSync = void 0;

/* eslint-disable no-void */

/**
 * Truncates the middle of a string.
 * @param str - The string to truncate
 * @param n - The number of characters to preserver
 * @returns
 */
var truncateMid = function truncateMid(str) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  return "".concat(str.slice(0, n), "...").concat(str.slice(-n));
};

exports.truncateMid = truncateMid;

var noopSync = function noopSync() {
  // Make sure undefined is not overridden
  return void 0;
};

exports.noopSync = noopSync;