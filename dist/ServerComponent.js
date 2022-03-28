"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProps = exports.useAction = exports.ServerComponent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _hooks = require("./hooks");

var _logger = require("./lib/logger");

var _jsxRuntime = require("react/jsx-runtime");

var _excluded = ["name", "scope", "children", "host", "index"],
    _excluded2 = ["children"];

var _templateObject;

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var context = _react.default.createContext({});

var internalContext = _react.default.createContext({});

var useAction = function useAction(name, handler) {
  var _action$props, _action$props2;

  var ctx = (0, _react.useContext)(internalContext);
  var _ctx$children = ctx.children,
      children = _ctx$children === void 0 ? [] : _ctx$children;
  var action = children.find(function (child) {
    return child.component === 'Action' && child.props.name === name;
  });
  if (!action) return function () {
    _logger.orgLogger.scope('useAction').warning(_templateObject || (_templateObject = _taggedTemplateLiteral(["Handler '", "' not available. Are you sure your component is rendering this action on the server?"])), name);
  };

  if (action && action !== null && action !== void 0 && (_action$props = action.props) !== null && _action$props !== void 0 && _action$props.fns && action !== null && action !== void 0 && (_action$props2 = action.props) !== null && _action$props2 !== void 0 && _action$props2.fns[handler]) {
    if (action.props.disabled) action.props.fns[handler].disabled = true;
    return action.props.fns[handler];
  }

  if (action.props.disabled) action.handler.disabled = true;
  return action.handler;
};

exports.useAction = useAction;

var useProps = function useProps() {
  return (0, _react.useContext)(context);
}; // const ChildComponent = (props) => {
//   const ctx = useContext(internalContext)
//   const { children = [] } = ctx
//   const { index } = props
//   const serverChildren = children.filter((child) => {
//     return child.component === 'ClientComponent'
//   })
//   const serverProps = serverChildren[index]
//   console.log('CHILD COMPONENT', serverChildren, serverProps, children, ctx)
//   return props.children
//   const mappedProps = Object.entries(serverProps).reduce(
//     (obj, [key, state]) => {
//       if (state) state[Symbol.for('l0g.format')] = () => state.value
//       if (resolved[state.key]) {
//         // logger.error('HAS RESOLVED', obj, key);
//         return Object.assign(obj, {
//           [key]: resolved[state.key]
//         })
//       }
//       /** Map a live state to a property */
//       if (state.id && state.key && state.scope)
//         return Object.assign(obj, {
//           [key]: state.value
//         })
//       return Object.assign(obj, { [key]: state })
//     },
//     {}
//   )
//   mappedProps.error = error
//   return (
//     <internalContext.Provider value={serverProps}>
//       <context.Provider value={mappedProps}>{props.children}</context.Provider>
//     </internalContext.Provider>
//   )
// }


exports.useProps = useProps;

var ServerComponent = function ServerComponent(props) {
  var name = props.name,
      scope = props.scope,
      children = props.children,
      host = props.host,
      _props$index = props.index,
      index = _props$index === void 0 ? 0 : _props$index,
      clientProps = _objectWithoutProperties(props, _excluded);

  var parentCtx = (0, _react.useContext)(internalContext);
  var rendered;

  if (parentCtx) {
    var parentChildren = [parentCtx.children].flat(2).filter(function (c) {
      return (c === null || c === void 0 ? void 0 : c.component) === 'ClientComponent';
    });
    var child = parentChildren.find(function (_ref) {
      var key = _ref.key;
      return key === name;
    }) || parentChildren[index];
    rendered = child;
  }

  var component = (0, _hooks.useComponent)(name, {
    scope: scope,
    props: clientProps,
    host: host
  }, rendered);
  var _component$props = component.props,
      serverProps = _component$props === void 0 ? {} : _component$props,
      resolved = component.resolved,
      error = component.error,
      loading = component.loading; // eslint-disable-next-line @typescript-eslint/no-unused-vars

  var _serverChildren = serverProps.children,
      rest = _objectWithoutProperties(serverProps, _excluded2);

  var mappedProps = Object.entries(rest).reduce(function (obj, _ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        state = _ref3[1];

    if (typeof resolved[key] !== 'undefined') {
      return Object.assign(obj, _defineProperty({}, key, resolved[key]));
    }
    /** Map a live state to a property */


    if (state && state.id && state.key && state.scope) return Object.assign(obj, _defineProperty({}, key, state.value));
    return Object.assign(obj, _defineProperty({}, key, state));
  }, {});
  Object.assign(mappedProps, {
    error: error,
    loading: loading
  }); // const serverPropsMemo = useMemo(() => {
  //     return { ...serverProps, name };
  // }, [name, JSON.stringify(serverProps)]);

  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    (0, _jsxRuntime.jsx)(internalContext.Provider, {
      value: _objectSpread(_objectSpread({}, serverProps), {}, {
        name: name
      }),
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(context.Provider, {
        value: mappedProps,
        children: children
      })
    })
  );
};

exports.ServerComponent = ServerComponent;
ServerComponent.childMap = {};