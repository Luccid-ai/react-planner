"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ToolbarButton;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var SharedStyle = _interopRequireWildcard(require("../../styles/shared-style"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
//http://www.cssportal.com/css-tooltip-generator/

var STYLE = {
  width: '30px',
  height: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '5px',
  marginLeft: '5px',
  marginRight: '5px',
  fontSize: '25px',
  position: 'relative',
  cursor: 'pointer'
};
var STYLE_TOOLTIP = {
  position: 'absolute',
  width: '140px',
  color: SharedStyle.COLORS.white,
  background: SharedStyle.COLORS.black,
  height: '30px',
  lineHeight: '30px',
  textAlign: 'center',
  visibility: 'visible',
  borderRadius: '6px',
  opacity: '0.8',
  left: '100%',
  top: '50%',
  marginTop: '-15px',
  marginLeft: '15px',
  zIndex: '999',
  fontSize: '12px'
};
var STYLE_TOOLTIP_PIN = {
  position: 'absolute',
  top: '50%',
  right: '100%',
  marginTop: '-8px',
  width: '0',
  height: '0',
  borderRight: '8px solid #000000',
  borderTop: '8px solid transparent',
  borderBottom: '8px solid transparent'
};
function ToolbarButton(props) {
  var _useState = (0, _react.useState)({
      active: false
    }),
    _useState2 = _slicedToArray(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  var color = props.active || state.active ? SharedStyle.SECONDARY_COLOR.icon : SharedStyle.PRIMARY_COLOR.icon;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: STYLE,
    onMouseOver: function onMouseOver(event) {
      return setState({
        active: true
      });
    },
    onMouseOut: function onMouseOut(event) {
      return setState({
        active: false
      });
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      color: color
    },
    onClick: props.onClick
  }, props.children), state.active ? /*#__PURE__*/_react["default"].createElement("div", {
    style: STYLE_TOOLTIP
  }, /*#__PURE__*/_react["default"].createElement("span", {
    style: STYLE_TOOLTIP_PIN
  }), props.tooltip) : null);
}
ToolbarButton.propTypes = {
  active: _propTypes["default"].bool.isRequired,
  tooltip: _propTypes["default"].string.isRequired
};