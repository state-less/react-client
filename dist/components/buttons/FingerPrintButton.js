"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FingerprintButton = void 0;

var _material = require("@mui/material");

var _clsx = _interopRequireDefault(require("clsx"));

var _util = require("../../util");

var _jsxRuntime = require("react/jsx-runtime");

var _excluded = ["children", "t"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var _require = require('@state-less/react-client'),
    useClientContext = _require.useClientContext,
    useAuth = _require.useAuth,
    fingerprintStrategy = _require.fingerprintStrategy;

var LABEL_BUTTON = 'Fingerprint';
var TITLE_TOOLTIP_AUTH = 'Authenticated';
var translate = Function.prototype;

/**
 * A button that attempts fingerprint based authentication against a react-server.
 * @param t - Optional translation function from react-i18n.
 * @returns
 */
var FingerprintButton = function FingerprintButton(_ref) {
  var _identity$fingerprint;

  var _ref$children = _ref.children,
      children = _ref$children === void 0 ? null : _ref$children,
      _ref$t = _ref.t,
      t = _ref$t === void 0 ? null : _ref$t,
      rest = _objectWithoutProperties(_ref, _excluded);

  var _useClientContext = useClientContext(),
      identity = _useClientContext.identity;

  var _useAuth = useAuth(fingerprintStrategy),
      authenticate = _useAuth.authenticate;

  var color = (0, _clsx.default)({
    success: identity === null || identity === void 0 ? void 0 : identity.fingerprint,
    warning: !(identity !== null && identity !== void 0 && identity.fingerprint)
  });
  var text = !(identity !== null && identity !== void 0 && identity.fingerprint) ? LABEL_BUTTON : (0, _util.truncateMid)(identity === null || identity === void 0 ? void 0 : (_identity$fingerprint = identity.fingerprint) === null || _identity$fingerprint === void 0 ? void 0 : _identity$fingerprint.visitorId);
  var tooltipTitle = t ? t(TITLE_TOOLTIP_AUTH) : TITLE_TOOLTIP_AUTH;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Tooltip, {
    title: tooltipTitle,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Button, _objectSpread(_objectSpread({
      color: color,
      variant: "contained",
      onClick: function onClick() {
        return authenticate();
      }
    }, rest), {}, {
      children: text
    }))
  });
};

exports.FingerprintButton = FingerprintButton;