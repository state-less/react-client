"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.truncateMid = exports.noopSync = exports.isSingleHost = exports.getSingleHost = exports.assertGetSingleHost = void 0;

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

var isSingleHost = function isSingleHost(hosts) {
  return Object.keys(hosts).length === 1;
};

exports.isSingleHost = isSingleHost;

var getSingleHost = function getSingleHost(hosts) {
  return Object.keys(hosts)[0];
};

exports.getSingleHost = getSingleHost;

var assertGetSingleHost = function assertGetSingleHost(sockets, host) {
  if (host === null) {
    if (isSingleHost(sockets)) {
      host = getSingleHost(sockets);
    } else {
      throw new Error("Missing required prop 'host' when using multiple hosts.");
    }
  }

  return host;
};

exports.assertGetSingleHost = assertGetSingleHost;