"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapPromise = wrapPromise;
function wrapPromise(promise) {
  var status = 'pending';
  var response;
  var suspender = promise.then(function (res) {
    status = 'success';
    response = res;
  }, function (err) {
    status = 'error';
    response = err;
  });
  return function () {
    switch (status) {
      case 'pending':
        throw suspender;
      case 'error':
        throw response;
      default:
        return response;
    }
  };
}