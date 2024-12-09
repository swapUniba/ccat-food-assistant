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
import { TextMessage } from "./TextMessage";
import './ChatRoomMessage.css';
var MessageMetadataStyle = {
  fontSize: '0.6rem'
};
export var ChatRoomMessage = /*#__PURE__*/function (_React$Component) {
  function ChatRoomMessage(props) {
    var _this;
    _classCallCheck(this, ChatRoomMessage);
    _this = _callSuper(this, ChatRoomMessage, [props]);
    _defineProperty(_this, "isMine", function (_) {
      return parseInt(_this.props.messageData.sender_id) === parseInt(_this.props.idSelf);
    });
    _defineProperty(_this, "getMessageComponent", function (_ref) {
      var type = _ref.type,
        metadata = _ref.metadata;
      switch (type) {
        case 'text':
        case 'auto':
          return TextMessage;
        default:
          return React.Fragment;
      }
    });
    _this.state = {};
    return _this;
  }
  _inherits(ChatRoomMessage, _React$Component);
  return _createClass(ChatRoomMessage, [{
    key: "render",
    value: function render() {
      var sendDate = moment(this.props.messageData.created_at).format('ddd D MMM');
      var isMine = this.isMine();
      var Message = this.getMessageComponent(this.props.messageData);
      return /*#__PURE__*/React.createElement(React.Fragment, null, this.props.showOwnDate && /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-center my-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-inline-block bg-white small px-2 py-1 text-capitalize rounded shadow-sm"
      }, sendDate)), /*#__PURE__*/React.createElement(Message, {
        isMine: isMine,
        isLast: this.props.isLast,
        messageData: this.props.messageData,
        getMediaContentUrlAPI: this.props.getMediaContentUrlAPI,
        widget: this.props.widget
      }));
    }
  }]);
}(React.Component);
ChatRoomMessage.propTypes = {
  messageData: PropTypes.object.isRequired,
  idSelf: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  isLast: PropTypes.bool.isRequired,
  showOwnDate: PropTypes.bool,
  getMediaContentUrlAPI: PropTypes.func.isRequired,
  widget: PropTypes.element
};
//# sourceMappingURL=ChatRoomMessage.js.map