function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
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
import { NEW_CHAT_MESSAGE_EVT, ChatRoomView } from "../Chat/ChatPane/ChatRoomView";
import { AiAssistantAPI } from "../API/AiAssistant/AiAssistantAPI";
import { GenericListGroupWidget } from "./Widgets/Listgroup/GenericListGroupWidget";
import { ButtonsListWidget } from "./Widgets/ButtonsList/ButtonsListWidget";
import { DotTypingLoader } from "../BaseComponents/DotTypingLoader/DotTypingLoader";
import { AiAssistantChatRoomTextBox, ASSISTANT_MODE_DECLARATIVE } from "./AiAssistantChatRoomTextBox";
import { RecipesListGroupWidget } from "../../react-components-dist/AiAssistant/Widgets/RecipesListgroup/RecipesListGroupWidget";
var ASSISTANT_MODE_LOCAL_STORAGE_KEY = '__AI_ASSISTANT_MODE';
export var AiAssistantChatRoomView = /*#__PURE__*/function (_React$Component) {
  function AiAssistantChatRoomView(props) {
    var _this;
    _classCallCheck(this, AiAssistantChatRoomView);
    _this = _callSuper(this, AiAssistantChatRoomView, [props]);
    _defineProperty(_this, "doNothing", function (_) {});
    _defineProperty(_this, "handleModeChange", function (mode) {
      return _this.setState({
        assistantMode: mode
      }, function (_) {
        localStorage.setItem(ASSISTANT_MODE_LOCAL_STORAGE_KEY, mode);
      });
    });
    /**
     * This function is used as wrapper around the basic api for retrieving messages with the AI assistant. It allow
     * us to get information about the message list and return back to the caller the results in a transparent way.
     * */
    _defineProperty(_this, "getMessageAPIGateway", function (room_id, limit, cursor) {
      return new Promise(function (resolve, reject) {
        AiAssistantAPI.User.getMessages(room_id, limit, cursor).then(function (data) {
          if (data.messages.length) {
            _this.setState({
              assistantAnswered: data.messages[0].sender_id != _this.props.idSelf
            });
          }
          resolve(data);
        })["catch"](reject);
      });
    });
    _defineProperty(_this, "processMessageData", function (m) {
      return _objectSpread(_objectSpread({}, m), {}, {
        content: m.content.replace(new RegExp('\{\{widget\}\}', 'g'), '')
      });
    });
    _defineProperty(_this, "widgetRenderer", function (m, isLastMessage) {
      if (m.content.indexOf('{{widget}}') == -1) return '';
      if (!m.metadata.widgets || !m.metadata.widgets.length) return '';
      return m.metadata.widgets.map(function (widget) {
        switch (widget.type) {
          case 'list-group':
          case 'custom-list-group':
            switch (widget.semtype) {
              case 'recipes':
                return /*#__PURE__*/React.createElement(RecipesListGroupWidget, {
                  widget: widget,
                  onGeneratedPrompt: _this.handleWidgetGeneratedPrompt
                });
              default:
                return /*#__PURE__*/React.createElement(GenericListGroupWidget, {
                  widget: widget,
                  disabled: !isLastMessage,
                  onGeneratedPrompt: _this.handleWidgetGeneratedPrompt
                });
            }
          case 'buttons-list':
            return /*#__PURE__*/React.createElement(ButtonsListWidget, {
              widget: widget,
              disabled: !isLastMessage,
              onGeneratedPrompt: _this.handleWidgetGeneratedPrompt
            });
        }
      });
    });
    _defineProperty(_this, "handleWidgetGeneratedPrompt", function (frontendPrompt, backendPrompt) {
      AiAssistantAPI.User.sendTextMessage(_this.props.roomId, frontendPrompt, [], backendPrompt).then(function (_) {
        return FuxEvents.emit(NEW_CHAT_MESSAGE_EVT, _this.props.roomId);
      });
    });
    _defineProperty(_this, "getMessageListFooter", function (_) {
      if (_this.state.assistantAnswered) return '';
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex yours"
      }, /*#__PURE__*/React.createElement("div", {
        className: "message last"
      }, /*#__PURE__*/React.createElement(DotTypingLoader, null)));
    });
    _defineProperty(_this, "sendMessageProxyAPI", function (room_id, text, attachments, assistant_specific_prompt) {
      return AiAssistantAPI.User.sendTextMessage(room_id, text, attachments, assistant_specific_prompt, _this.state.assistantMode);
    });
    _this.state = {
      assistantAnswered: true,
      assistantMode: ''
    };
    _this.textBoxComponent = AiAssistantChatRoomTextBox(_this.handleModeChange, localStorage.getItem(ASSISTANT_MODE_LOCAL_STORAGE_KEY));
    return _this;
  }
  _inherits(AiAssistantChatRoomView, _React$Component);
  return _createClass(AiAssistantChatRoomView, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ChatRoomView, {
        roomId: this.props.roomId,
        idSelf: this.props.idSelf,
        getMessageAPI: this.getMessageAPIGateway,
        getMediaContentUrlAPI: AiAssistantAPI.User.getMediaContentUrl,
        sendMessageAPI: this.sendMessageProxyAPI,
        setReadAPI: null,
        sendNotificationAPI: null,
        fetchMessageEventName: NEW_CHAT_MESSAGE_EVT,
        showAudioRecordingButton: false,
        showAttachmentsButton: false,
        messageProcessor: this.processMessageData,
        messageWidgetRenderer: this.widgetRenderer,
        messageListFooter: this.getMessageListFooter(),
        textBoxComponent: this.textBoxComponent,
        disableSend: !this.state.assistantAnswered
      }));
    }
  }]);
}(React.Component);
AiAssistantChatRoomView.propTypes = {
  roomId: PropTypes.any,
  idSelf: PropTypes.any
};
//# sourceMappingURL=AiAssistantChatRoomView.js.map