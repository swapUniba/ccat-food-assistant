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
import { Portal } from "../../Portal/Portal";
export var TippyTooltip = /*#__PURE__*/function (_React$Component) {
  function TippyTooltip(props) {
    var _this;
    _classCallCheck(this, TippyTooltip);
    _this = _callSuper(this, TippyTooltip, [props]);
    _defineProperty(_this, "handleRef", function (node) {
      if (!node) return;
      if (_this.tippyInstance) _this.tippyInstance.destroy();
      _this.tippyInstance = tippy(node, {
        content: _this.contentDom,
        theme: 'light',
        allowHTML: _this.props.allowHTML,
        arrow: _this.props.arrow,
        interactive: _this.props.interactive,
        placement: _this.props.placement,
        trigger: _this.props.trigger,
        offset: _this.props.offset,
        appendTo: _this.props.appendTo,
        sticky: _this.props.sticky,
        showOnCreate: _this.props.showOnCreate,
        hideOnClick: _this.props.hideOnClick
      });
    });
    _this.tippyInstance = null;
    _this.contentDom = document.createElement('div');
    return _this;
  }
  _inherits(TippyTooltip, _React$Component);
  return _createClass(TippyTooltip, [{
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      if (this.tippyInstance) {
        this.tippyInstance.destroy();
      }
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        ref: this.handleRef
      }, this.props.children), /*#__PURE__*/React.createElement(Portal, {
        domNode: this.contentDom
      }, this.props.content));
    }
  }]);
}(React.Component);
TippyTooltip.propTypes = {
  content: PropTypes.string,
  interactive: PropTypes.bool,
  allowHTML: PropTypes.bool,
  arrow: PropTypes.bool,
  placement: PropTypes.string,
  trigger: PropTypes.string,
  offset: PropTypes.arrayOf(PropTypes.number),
  appendTo: PropTypes.func,
  sticky: PropTypes.bool,
  showOnCreate: PropTypes.bool,
  hideOnClick: PropTypes.bool
};
TippyTooltip.defaultProps = {
  placement: 'top',
  allowHTML: false,
  arrow: true,
  interactive: false,
  sticky: false,
  trigger: 'mouseenter focus',
  offset: [0, 0]
};
//# sourceMappingURL=TippyTooltip.js.map