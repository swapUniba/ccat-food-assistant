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
import { GenericListGroupWidgetItem } from "./GenericListGroupWidgetItem";
export var GenericListGroupWidget = /*#__PURE__*/function (_React$Component) {
  function GenericListGroupWidget(props) {
    var _this;
    _classCallCheck(this, GenericListGroupWidget);
    _this = _callSuper(this, GenericListGroupWidget, [props]);
    /**
     * When an item of the list is selected two prompts are generated:
     * - frontend prompt: which is the one that will be displayed to the user
     * - backend prompt: which is the one that will be used to generate a new response on the llm/assistant side
     * */
    _defineProperty(_this, "handleChoose", function (data) {
      if (_this.props.disabled) return;
      _this.props.onGeneratedPrompt(data[_this.props.widget.label], "".concat(_this.props.widget["return"], " = ").concat(data[_this.props.widget["return"]]));
    });
    _this.state = {};
    return _this;
  }
  _inherits(GenericListGroupWidget, _React$Component);
  return _createClass(GenericListGroupWidget, [{
    key: "render",
    value: function render() {
      var _this2 = this;
      var widget = this.props.widget;
      return /*#__PURE__*/React.createElement("div", {
        className: "list-group list-group-flush my-3"
      }, widget.data.map(function (item) {
        return /*#__PURE__*/React.createElement(GenericListGroupWidgetItem, {
          disabled: _this2.props.disabled,
          data: item,
          label: widget.label,
          onChoose: _this2.handleChoose
        });
      }));
    }
  }]);
}(React.Component);
GenericListGroupWidget.propTypes = {
  widget: PropTypes.shape({
    data: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
    semtype: PropTypes.string,
    "return": PropTypes.string,
    label: PropTypes.string
  }),
  disabled: PropTypes.bool,
  onGeneratedPrompt: PropTypes.func
};
//# sourceMappingURL=GenericListGroupWidget.js.map