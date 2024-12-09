function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
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
import { FaSolidIcon } from "../../FontAwesome/FontAwesome";
import { ChatRoomMessage } from "./Message/ChatRoomMessage";
var WrapperStyle = {
  backgroundColor: "#dadde1",
  maxHeight: 'calc(100vh - 116px )'
};
var MESSAGE_FETCH_LIMIT = 20;
var CHAT_UPDATE_MESSAGES = 'CHAT_UPDATE_MESSAGES';
export var CHAT_SCROLL_TO_BOTTOM = 'CHAT_SCROLL_TO_BOTTOM';
export var CHAT_READ_EVT = 'CHAT_READ_EVT';
export var NEW_CHAT_MESSAGE_EVT = 'NEW_CHAT_MESSAGE_EVT';
export var ChatRoomView = /*#__PURE__*/function (_React$Component) {
  function ChatRoomView(props) {
    var _this;
    _classCallCheck(this, ChatRoomView);
    _this = _callSuper(this, ChatRoomView, [props]);
    _defineProperty(_this, "fetchNewMessagesLoop", function (_) {
      if (_this.shouldUpdateMessageList) {
        setTimeout(function (_) {
          _this.fetchNewMessages(false, _this.fetchNewMessagesLoop);
        }, 3000);
      }
    });
    _defineProperty(_this, "handleUpdateMessages", function (id_chat_room) {
      if (id_chat_room === _this.props.roomId) {
        _this.fetchInitialMessages(_this.state.messages.length);
      }
    });
    _defineProperty(_this, "handleInputChange", function (_ref) {
      var target = _ref.target;
      if (_this.state.sendingMessage) return;
      _this.setState(_defineProperty({}, target.name, target.value));
    });
    _defineProperty(_this, "handleExternalTextMessage", function (msg) {
      return _this.setState({
        text: msg
      });
    });
    _defineProperty(_this, "fetchInitialMessages", function (messagesNum) {
      _this.props.getMessageAPI(_this.props.roomId, messagesNum, null).then(function (data) {
        _this.setState({
          messages: data.messages.reverse(),
          afterCursor: data.cursors.after,
          beforeCursor: data.cursors.before
        }, _this.scrollToBottom);
      });
    });
    _defineProperty(_this, "fetchNewMessages", function (silent, onStateUpdate) {
      return _this.props.getMessageAPI(_this.props.roomId, MESSAGE_FETCH_LIMIT, _this.state.afterCursor).then(function (data) {
        if (data.messages.length) {
          var newMessagesList = _toConsumableArray(_this.state.messages);
          data.messages.reverse().map(function (m) {
            if (!newMessagesList.find(function (mm) {
              return mm.message_id === m.message_id;
            })) newMessagesList.push(m);
          });
          _this.setState({
            messages: newMessagesList,
            afterCursor: data.cursors.after //Aggiorno solo il cursore after
          }, function (_) {
            if (!silent) _this.scrollToBottom();
            if (onStateUpdate) onStateUpdate();
            if (_this.props.setReadAPI) _this.props.setReadAPI(_this.props.roomId).then(function (_) {
              return FuxEvents.emit(CHAT_READ_EVT);
            });
          });
        } else {
          if (onStateUpdate) onStateUpdate();
        }
      });
    });
    _defineProperty(_this, "fetchOldMessages", function (_) {
      return _this.props.getMessageAPI(_this.props.roomId, MESSAGE_FETCH_LIMIT, _this.state.beforeCursor).then(function (data) {
        _this.saveScrollPoint();
        var newMessagesList = _toConsumableArray(data.messages.reverse());
        _this.state.messages.map(function (m) {
          if (!newMessagesList.find(function (mm) {
            return mm.message_id === m.message_id;
          })) newMessagesList.push(m);
        });
        _this.setState({
          messages: newMessagesList,
          beforeCursor: data.cursors.before //Aggiorno solo il cursore after
        });
      });
    });
    _defineProperty(_this, "handleInputFormSubmit", function (e) {
      e.preventDefault();
      _this.handleSendMessage();
    });
    _defineProperty(_this, "handleSendMessage", function (_) {
      _this.sendMessage(_this.state.text);
    });
    _defineProperty(_this, "sendMessage", function (text) {
      _this.setState({
        sendingMessage: true
      });
      _this.inputRef.current.focus();
      _this.props.sendMessageAPI(_this.props.roomId, text).then(function (_ref2) {
        var message_id = _ref2.message_id,
          otp = _ref2.otp;
        if (_this.props.sendNotificationAPI) _this.props.sendNotificationAPI(_this.props.roomId, message_id, otp);
        _this.fetchNewMessages().then(function (_) {
          _this.setState({
            sendingMessage: false,
            text: ''
          });
        });
      })["catch"](function (message) {
        FuxSwalUtility.error(message);
        _this.setState({
          sendingMessage: false
        });
      });
    });
    _defineProperty(_this, "sendInitialMessage", function (_) {
      return _this.sendMessage("Ciao!");
    });
    _defineProperty(_this, "handleExternalNewMessage", function (room_id) {
      if (room_id === _this.props.roomId) {
        _this.fetchNewMessages(false, function (_) {
          var messageList = _this.state.messages.slice().map(function (m) {
            m.is_read = "1";
            return m;
          });
          _this.setState({
            messages: messageList
          });
        });
        if (_this.props.setReadAPI) _this.props.setReadAPI(_this.props.roomId);
      }
    });
    /** @MARK: Scroll utilities */
    _defineProperty(_this, "scrollToBottom", function (_) {
      if (_this.scrollPaneRef.current) {
        _this.scrollPaneRef.current.scrollTop = _this.scrollPaneRef.current.scrollHeight;
      }
    });
    _defineProperty(_this, "saveScrollPoint", function (_) {
      if (_this.scrollPaneRef.current) {
        _this.curScrollPos = _this.scrollPaneRef.current.scrollTop;
        _this.oldScroll = _this.scrollPaneRef.current.scrollHeight - _this.scrollPaneRef.current.clientHeight;
      }
    });
    _defineProperty(_this, "restoreScrollPoint", function (_) {
      if (_this.oldScroll !== null && _this.curScrollPos !== null) {
        var newScroll = _this.scrollPaneRef.current.scrollHeight - _this.scrollPaneRef.current.clientHeight;
        _this.scrollPaneRef.current.scrollTop = _this.curScrollPos + (newScroll - _this.oldScroll);
        _this.oldScroll = null;
        _this.curScrollPos = null;
      }
    });
    _this.state = {
      text: '',
      messages: [],
      afterCursor: null,
      beforeCursor: null,
      sendingMessage: false,
      isRecording: false
    };
    _this.inputRef = /*#__PURE__*/React.createRef();
    _this.scrollPaneRef = /*#__PURE__*/React.createRef();
    _this.shouldUpdateMessageList = true;
    return _this;
  }
  _inherits(ChatRoomView, _React$Component);
  return _createClass(ChatRoomView, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      FuxEvents.on(this.props.fetchMessageEventName, this.handleExternalNewMessage);
      FuxEvents.on(CHAT_UPDATE_MESSAGES, this.handleUpdateMessages);
      FuxEvents.on(CHAT_SCROLL_TO_BOTTOM, this.scrollToBottom);
      FuxEvents.on('__chat_message__', this.handleExternalTextMessage);
      this.fetchInitialMessages(MESSAGE_FETCH_LIMIT);
      this.fetchNewMessagesLoop();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      FuxEvents.off(this.props.fetchMessageEventName, this.handleExternalNewMessage);
      FuxEvents.off(CHAT_UPDATE_MESSAGES, this.handleUpdateMessages);
      FuxEvents.off(CHAT_SCROLL_TO_BOTTOM, this.scrollToBottom);
      FuxEvents.off('__chat_message__', this.handleExternalTextMessage);
      this.shouldUpdateMessageList = false;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      //Riposiziona lo scroll del div alla posizione originale prima di aver preso messaggi più vecchi
      if (this.oldScroll !== null && this.curScrollPos !== null) {
        this.restoreScrollPoint();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex flex-column h-100",
        style: WrapperStyle
      }, /*#__PURE__*/React.createElement("div", {
        className: "px-3 overflow-auto py-4 flex-grow-1",
        ref: this.scrollPaneRef
      }, !this.state.messages.length && /*#__PURE__*/React.createElement("p", {
        className: "w-75 mx-auto text-center lead"
      }, "Inizia la tua conversazione, invia un saluto a Italo! ", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("button", {
        className: "btn btn-primary",
        onClick: this.sendInitialMessage
      }, "Ciao! \uD83D\uDC4B\uD83C\uDFFB")), !!this.state.beforeCursor && /*#__PURE__*/React.createElement("div", {
        className: "text-center",
        onClick: this.fetchOldMessages
      }, /*#__PURE__*/React.createElement("button", {
        className: "btn btn-sm btn-link text-primary"
      }, "Carica messaggi precedenti")), this.state.messages.map(function (m, i) {
        var prevMessage = i === 0 ? null : _this2.state.messages[i - 1];
        var nextMessage = i === _this2.state.messages.length - 1 ? null : _this2.state.messages[i + 1];
        var isLast = !nextMessage || nextMessage.sender_id !== m.sender_id;
        var showOwnDate = !prevMessage || moment(prevMessage.created_at).format('DD-MM-YYYY') !== moment(m.created_at).format('DD-MM-YYYY');
        var messageData = _this2.props.messageProcessor ? _this2.props.messageProcessor(m) : m;
        var widget = _this2.props.messageWidgetRenderer ? _this2.props.messageWidgetRenderer(m, i == _this2.state.messages.length - 1) : null;
        return /*#__PURE__*/React.createElement(ChatRoomMessage, {
          key: m.message_id,
          messageData: messageData,
          idSelf: _this2.props.idSelf,
          isLast: isLast,
          showOwnDate: showOwnDate,
          getMediaContentUrlAPI: _this2.props.getMediaContentUrlAPI,
          widget: widget
        });
      }), this.props.messageListFooter), /*#__PURE__*/React.createElement("div", {
        className: "bg-white shadow-sm p-2 border-top " + (!this.state.messages.length && 'd-none')
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("form", {
        onSubmit: this.handleInputFormSubmit,
        className: this.state.isRecording ? 'd-none' : 'flex-grow-1'
      }, /*#__PURE__*/React.createElement("div", {
        className: "d-flex align-items-center"
      }, /*#__PURE__*/React.createElement("input", {
        ref: this.inputRef,
        className: "form-control rounded-pill",
        type: "text",
        name: "text",
        autoComplete: "off",
        value: this.state.text,
        onChange: this.handleInputChange,
        onSubmit: this.handleSendMessage,
        placeholder: "Scrivi un messaggio"
      }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
        style: {
          width: 38,
          height: 38
        },
        className: "btn btn-primary rounded-circle d-flex align-items-center justify-content-center ml-2",
        disabled: !this.state.text || this.state.sendingMessage || this.props.disableSend,
        onClick: this.handleSendMessage
      }, this.state.sendingMessage ? /*#__PURE__*/React.createElement(FaSolidIcon, {
        name: "spin",
        className: "fa-spinner"
      }) : /*#__PURE__*/React.createElement(FaSolidIcon, {
        name: "paper-plane"
      }))))))));
    }
  }]);
}(React.Component);
ChatRoomView.propTypes = {
  roomId: PropTypes.any.isRequired,
  idSelf: PropTypes.any.isRequired,
  getMessageAPI: PropTypes.func.isRequired,
  getMediaContentUrlAPI: PropTypes.func.isRequired,
  sendMessageAPI: PropTypes.func.isRequired,
  setReadAPI: PropTypes.func.isRequired,
  sendNotificationAPI: PropTypes.func.isRequired,
  fetchMessageEventName: PropTypes.string.isRequired,
  showAttachmentsButton: PropTypes.bool,
  messageProcessor: PropTypes.func,
  messageWidgetRenderer: PropTypes.func,
  messageListFooter: PropTypes.element,
  disableSend: PropTypes.bool
};
ChatRoomView.defaultProps = {
  showAudioRecordingButton: true,
  showAttachmentsButton: true,
  disableSend: false
};
//# sourceMappingURL=ChatRoomView.js.map