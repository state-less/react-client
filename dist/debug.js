"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTraceUpdate = useTraceUpdate;

var _react = require("react");

var _logger = _interopRequireDefault(require("./logger"));

var _templateObject, _templateObject2;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var hookLogger = _logger.default.scope('useTraceUpdate');

function useTraceUpdate(props, name) {
  var prev = (0, _react.useRef)(props);
  (0, _react.useEffect)(function () {
    var changedProps = Object.entries(props).reduce(function (ps, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          k = _ref2[0],
          v = _ref2[1];

      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }

      return ps;
    }, {});

    if (Object.keys(changedProps).length > 0) {
      hookLogger.debug(_templateObject || (_templateObject = _taggedTemplateLiteral(["Propery ", " changed. New props are ", ""])), name, JSON.stringify(props));
    } else {
      hookLogger.debug(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["Propery ", " didn't change. New props are ", ""])), name, props);
    }

    prev.current = props;
  });
}