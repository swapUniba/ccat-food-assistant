function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(t, e) { if (e && ("object" == _typeof(e) || "function" == typeof e)) return e; if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined"); return _assertThisInitialized(t); }
function _assertThisInitialized(e) { if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return e; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(t) { return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) { return t.__proto__ || Object.getPrototypeOf(t); }, _getPrototypeOf(t); }
function _inherits(t, e) { if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function"); t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } }), Object.defineProperty(t, "prototype", { writable: !1 }), e && _setPrototypeOf(t, e); }
function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
import React from "react";
import PropTypes from "prop-types";
export var AiAssistantSpeechRecognitionButton = /*#__PURE__*/function (_React$Component) {
  function AiAssistantSpeechRecognitionButton(props) {
    var _this;
    _classCallCheck(this, AiAssistantSpeechRecognitionButton);
    _this = _callSuper(this, AiAssistantSpeechRecognitionButton, [props]);
    _defineProperty(_this, "handleStart", function (_) {
      var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert('Sembra che non sia possibile avviare il riconoscimento della voce su questo dispositivo');
        return;
      }
      var recognition = new SpeechRecognition();
      recognition.lang = _this.props.lang;
      recognition.onstart = function () {
        _this.setState({
          recognizing: true
        });
        if (_this.props.onRecognitionStart) _this.props.onRecognitionStart();
      };
      recognition.onend = function () {
        _this.setState({
          recognizing: false
        });
        if (_this.props.onRecognitionEnd) _this.props.onRecognitionEnd();
      };
      recognition.onerror = function (event) {
        console.error('Speech recognition error:', event.error);
        _this.setState({
          recognizing: false
        });
      };
      recognition.onresult = function (event) {
        var transcript = event.results[0][0].transcript;
        _this.props.onTextRecognition(transcript);
      };
      recognition.start();
    });
    _this.state = {
      recognizing: false
    };
    return _this;
  }
  _inherits(AiAssistantSpeechRecognitionButton, _React$Component);
  return _createClass(AiAssistantSpeechRecognitionButton, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement("button", {
        className: this.props.className,
        style: this.props.style,
        onClick: this.handleStart,
        disabled: this.state.recognizing,
        type: "button"
      }, this.props.children);
    }
  }]);
}(React.Component);
AiAssistantSpeechRecognitionButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  style: PropTypes.object,
  onTextRecognition: PropTypes.func,
  onRecognitionEnd: PropTypes.func,
  onRecognitionStart: PropTypes.func,
  lang: PropTypes.string
};
//# sourceMappingURL=AiAssistantSpeechRecognitionButton.js.map