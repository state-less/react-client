"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateMid = void 0;

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