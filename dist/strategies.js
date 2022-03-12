"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.webAuthnStrategy = exports.web3Strategy = exports.googleStrategy = exports.fingerprintStrategy = void 0;

var _react = require("react");

var _client = require("@webauthn/client");

var _fingerprintjs = _interopRequireDefault(require("@fingerprintjs/fingerprintjs"));

var _Web = require("./Web3");

var _util = require("./lib/util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var googleStrategy = function googleStrategy() {
  return {
    authenticate: function () {
      var _authenticate = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(challenge, token) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", {
                  challenge: challenge,
                  response: token.tokenId,
                  strategy: 'google',
                  success: true
                });

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function authenticate(_x, _x2) {
        return _authenticate.apply(this, arguments);
      }

      return authenticate;
    }(),
    logout: _util.noopSync,
    id: 'google',
    strategy: 'google'
  };
};

exports.googleStrategy = googleStrategy;

var web3Strategy = function web3Strategy(_ref) {
  var _ref$autoLogin = _ref.autoLogin,
      autoLogin = _ref$autoLogin === void 0 ? false : _ref$autoLogin;

  var _useContext = (0, _react.useContext)(_Web.web3Context),
      account = _useContext.account,
      activateInjected = _useContext.activateInjected,
      sign = _useContext.sign,
      deactivate = _useContext.deactivate;

  var connect = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return activateInjected();

            case 2:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function connect() {
      return _ref2.apply(this, arguments);
    };
  }();

  (0, _react.useEffect)(function () {
    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return connect();

            case 2:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }))();
  }, []);

  var authenticate = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(challenge) {
      var response;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!(account && challenge.type === 'sign')) {
                _context4.next = 5;
                break;
              }

              _context4.next = 3;
              return sign(challenge.challenge, account);

            case 3:
              response = _context4.sent;
              return _context4.abrupt("return", {
                challenge: challenge,
                response: response,
                success: true,
                strategy: 'web3'
              });

            case 5:
              _context4.next = 7;
              return activateInjected();

            case 7:
              return _context4.abrupt("return", {
                challenge: challenge,
                response: null,
                success: false,
                strategy: 'web3'
              });

            case 8:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    }));

    return function authenticate(_x3) {
      return _ref4.apply(this, arguments);
    };
  }();

  return {
    authenticate: authenticate,
    id: account,
    logout: deactivate,
    strategy: 'web3'
  };
};

exports.web3Strategy = web3Strategy;

var webAuthnStrategy = function webAuthnStrategy() {
  var authenticate = /*#__PURE__*/function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(challenge) {
      var response;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!(challenge.type === 'register')) {
                _context5.next = 6;
                break;
              }

              _context5.next = 3;
              return (0, _client.solveRegistrationChallenge)(challenge.challenge);

            case 3:
              response = _context5.sent;
              _context5.next = 10;
              break;

            case 6:
              if (!(challenge.type === 'login')) {
                _context5.next = 10;
                break;
              }

              _context5.next = 9;
              return (0, _client.solveLoginChallenge)(challenge.challenge);

            case 9:
              response = _context5.sent;

            case 10:
              return _context5.abrupt("return", {
                challenge: challenge,
                response: response,
                success: true,
                strategy: 'webauthn',
                type: challenge.type
              });

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    }));

    return function authenticate(_x4) {
      return _ref5.apply(this, arguments);
    };
  }();

  return {
    authenticate: authenticate,
    logout: _util.noopSync,
    strategy: 'webauthn'
  };
};

exports.webAuthnStrategy = webAuthnStrategy;

var fingerprintStrategy = function fingerprintStrategy() {
  var authenticate = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(challenge) {
      var fp2, response;
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _fingerprintjs.default.load();

            case 2:
              fp2 = _context6.sent;
              _context6.next = 5;
              return fp2.get();

            case 5:
              response = _context6.sent;
              return _context6.abrupt("return", {
                challenge: challenge,
                response: response,
                success: true,
                strategy: 'fingerprint',
                type: challenge.type
              });

            case 7:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    }));

    return function authenticate(_x5) {
      return _ref6.apply(this, arguments);
    };
  }();

  return {
    authenticate: authenticate,
    logout: _util.noopSync,
    strategy: 'fingerprint'
  };
};

exports.fingerprintStrategy = fingerprintStrategy;