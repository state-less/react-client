"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.packageLogger = exports.orgLogger = exports.default = void 0;

var _l0g = _interopRequireDefault(require("l0g"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Logger = _l0g.default.Logger,
    Color = _l0g.default.formatters.Color,
    ChromeTransport = _l0g.default.transports.ChromeTransport;
Color.colors.type.string = 'green';
Color.colors.type.object = 'green';
Color.colors.key.level.warning = 'red';
Color.colors.key.level.info = 'blue';
var formatter = new Color(function (options) {
  var ts = options.ts,
      level = options.level,
      scope = options.scope,
      message = options.message;
  return "".concat(ts, " ").concat(scope, " ").concat(level, ": ").concat(message);
});
Color.formatMap.get(Color.isArray).unshift(function (v) {
  return v && "Array[".concat(v.length, "]");
});
Color.formatMap.get(Color.isObject).unshift(function (v) {
  return v && "".concat(v.constructor.name, "[").concat(Object.keys(v), "]");
});
var transports = [new ChromeTransport({
  formatter: formatter
})];
var orgLogger = new Logger('debug', {
  transports: transports
}).scope('state-less');
exports.orgLogger = orgLogger;
var packageLogger = orgLogger.scope('react-client');
exports.packageLogger = packageLogger;
var windowLogger = orgLogger.scope('browser-console');

if (typeof window !== 'undefined') {
  window.logger = windowLogger;
}

var _default = packageLogger;
exports.default = _default;