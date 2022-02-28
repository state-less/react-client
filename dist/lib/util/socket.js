"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = exports.parseSocketResponse = exports.onMessage = exports.on = exports.off = exports.emit = exports.consume = void 0;
exports.setupWsHeartbeat = setupWsHeartbeat;

var _uuid = require("uuid");

var _logger = _interopRequireWildcard(require("../logger"));

var _templateObject, _templateObject2, _templateObject3;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var parseSocketResponse = function parseSocketResponse(data) {
  var body = data.body,
      statusCode = data.statusCode,
      message = data.message;

  if (statusCode !== 200 && statusCode !== 500) {
    throw new Error(message || 'Internal Server Error');
  }

  try {
    var parsed = JSON.parse(body);
    return parsed;
  } catch (e) {
    var _message = _logger.default.warning(_templateObject || (_templateObject = _taggedTemplateLiteral(["Error parsing render result ", ""])), e);

    throw new Error(_message);
  }
};

exports.parseSocketResponse = parseSocketResponse;

var emit = function emit(socket, data) {
  if (Array.isArray(socket)) {
    socket.forEach(function (socket) {
      socket.send(JSON.stringify(data));
    });
  } else {
    socket.send(JSON.stringify(data));
  }
};

exports.emit = emit;

var request = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(socket, data) {
    var id;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            id = (0, _uuid.v4)();
            emit(socket, _objectSpread(_objectSpread({
              type: request
            }, data), {}, {
              id: id
            }));
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              var onResponse = /*#__PURE__*/function () {
                var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(event) {
                  var data, json;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          _context.next = 2;
                          return consume(event);

                        case 2:
                          data = _context.sent;
                          json = parseSocketResponse(data);

                          if (data.id === id) {
                            if (data.type === 'error') {
                              reject(json);
                            } else {
                              resolve(json);
                            }

                            off(socket, 'message', onResponse);
                          }

                        case 5:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function onResponse(_x3) {
                  return _ref2.apply(this, arguments);
                };
              }();

              on(socket, 'message', onResponse);
            }));

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function request(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.request = request;

var on = function on(socket, event, fn) {
  if (Array.isArray(socket)) {
    socket.forEach(function (socket) {
      socket.addEventListener(event, fn);
    });
  } else {
    socket.addEventListener(event, fn);
  }
};

exports.on = on;

var off = function off(socket, event, fn) {
  if (Array.isArray(socket)) {
    socket.forEach(function (socket) {
      socket.removeEventListener(event, fn);
    });
  } else {
    socket.removeEventListener(event, fn);
  }
};

exports.off = off;

var onMessage = function onMessage(socket, fn) {
  return on(socket, 'message', fn);
};

exports.onMessage = onMessage;

var consume = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(event) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            return _context3.abrupt("return", JSON.parse(event.data));

          case 4:
            _context3.prev = 4;
            _context3.t0 = _context3["catch"](0);

            if (!(typeof event.data === 'string')) {
              _context3.next = 8;
              break;
            }

            return _context3.abrupt("return", event.data);

          case 8:
            throw _context3.t0;

          case 9:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 4]]);
  }));

  return function consume(_x4) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Tracks server pings for determining if the connection dropped.
 * Will terminate non-responsive connections.
 * This close event should initiate the process of recreating the connection in the ws module manager (eg ws/user.js and modules/ws-user.js)
 * @see https://gist.github.com/thiagof/aba7791ef9504c1184769ce401f478dc
 */


exports.consume = consume;

function setupWsHeartbeat(ws) {
  // will close the connection if there's no ping from the server
  function heartbeat() {
    var _this = this;

    clearTimeout(this.pingTimeout);

    _logger.orgLogger.debug(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["Sending heartbeat."]))); // Use `WebSocket#terminate()` and not `WebSocket#close()`. Delay should be
    // equal to the interval at which server sends out pings plus an assumption of the latency.


    this.pingTimeout = setTimeout(function () {
      _logger.orgLogger.warning(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["Ping timeout. Terminating socket connection."])));

      _this.terminate();
    }, 30000 + 1000);
  }

  ws.on('open', heartbeat);
  ws.on('ping', heartbeat);
  ws.on('close', function clear() {
    clearTimeout(this.pingTimeout);
  });
}