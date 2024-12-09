function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
import React from "react";
import { FaSolidIcon } from "../FontAwesome/FontAwesome";
import { AiAssistantSpeechRecognitionButton } from "./AiAssistantSpeechRecognitionButton";
export var ASSISTANT_MODE_PROCEDURAL = 'PROCEDURAL';
export var ASSISTANT_MODE_DECLARATIVE = 'DECLARATIVE';
var ASSISTANT_MODES = [{
  value: ASSISTANT_MODE_PROCEDURAL,
  label: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FaSolidIcon, {
    name: "robot"
  }), " Fai eseguire un'azione a Genny")
}, {
  value: ASSISTANT_MODE_DECLARATIVE,
  label: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement(FaSolidIcon, {
    name: "question"
  }), " Fai delle domande a Genny")
}];
export function AiAssistantChatRoomTextBox(onModeChange, initialMode) {
  return function (props) {
    var modeBtnStyle = {
      width: 40,
      height: 40
    };
    var _React$useState = React.useState(initialMode || ASSISTANT_MODE_DECLARATIVE),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      mode = _React$useState2[0],
      setMode = _React$useState2[1];
    var handleModeChange = function handleModeChange(newMode) {
      initialMode = mode;
      setMode(newMode);
      onModeChange(newMode);
    };
    var handleTextRecognition = function handleTextRecognition(text) {
      if (props.onRef && props.onRef.current) {
        var oldValue = props.onRef.current.value;
        props.onRef.current.value = oldValue ? oldValue + ' ' + text : text;
        props.onChange({
          target: props.onRef.current
        });
        if (props.onSubmit) props.onSubmit();
      }
    };
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "flex-grow-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center border rounded-pill py-1 pl-1 pr-2"
    }, /*#__PURE__*/React.createElement("input", _extends({
      ref: props.onRef
    }, props, {
      className: "form-control rounded-0 border-0",
      placeholder: "Write something to Italo"
    })), /*#__PURE__*/React.createElement(AiAssistantSpeechRecognitionButton, {
      className: "btn btn-link text-muted",
      lang: 'it-IT',
      onTextRecognition: handleTextRecognition,
      type: "button"
    }, /*#__PURE__*/React.createElement(FaSolidIcon, {
      name: "microphone"
    })))));
  };
}
//# sourceMappingURL=AiAssistantChatRoomTextBox.js.map