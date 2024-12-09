function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import PropTypes from "prop-types";
import { addCssToHead } from "../Helpers/CSSHelpers";
addCssToHead("\n.fas[data-badge], .far[data-badge], .fab[data-badge] {\n    position: relative;\n}\n\n[data-badge]:after {\n    display: block;\n    position: absolute;\n    top: -7px;\n    right: -14px;\n    content: attr(data-badge);\n    border-radius: 500px;\n    background: tomato;\n    color: #ffffff;\n    width: 17px;\n    height: 17px;\n    font-size: 11px;\n    text-align: center;\n    line-height: 17px;\n    font-family: sans-serif;\n}\n\n[data-badge].fa-badge-left:after {\n    right: initial;\n    left: -14px;\n}\n");
function FaIcon(props) {
  var classNames = "";
  if (props.badgeSide) classNames += " fa-badge-".concat(props.badgeSide);
  if (props.badgeColor) classNames += " fa-badge-".concat(props.badgeColor);
  return /*#__PURE__*/React.createElement("i", {
    style: props.style,
    className: "".concat(props.type, " fa-").concat(props.name, " fa-").concat(props.size, "x ").concat(classNames, " ").concat(props.className),
    "data-badge": props.badge,
    "data-badge-small": props.badgeSmall
  }, " ");
}
export function FaSolidIcon(props) {
  return /*#__PURE__*/React.createElement(FaIcon, _extends({
    type: "fas"
  }, props));
}
export function FaRegularIcon(props) {
  return /*#__PURE__*/React.createElement(FaIcon, _extends({
    type: "far"
  }, props));
}
export function FaBrandIcon(props) {
  return /*#__PURE__*/React.createElement(FaIcon, _extends({
    type: "fab"
  }, props));
}
//# sourceMappingURL=FontAwesome.js.map