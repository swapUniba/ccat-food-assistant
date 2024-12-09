export var _User = {
  getChatRoom: function getChatRoom(_) {
    return FuxHTTP.get("".concat(WEB_SERVER_URL, "/ai-assistant/chat/get-chat-room"), {}, FuxHTTP.RESOLVE_DATA, FuxHTTP.REJECT_MESSAGE);
  },
  refreshChatRoom: function refreshChatRoom(_) {
    return FuxHTTP.post("".concat(WEB_SERVER_URL, "/ai-assistant/chat/refresh-chat-room"), {}, FuxHTTP.RESOLVE_DATA, FuxHTTP.REJECT_MESSAGE);
  },
  getMessages: function getMessages(room_id, limit, cursor) {
    return FuxHTTP.get("".concat(WEB_SERVER_URL, "/ai-assistant/chat/get-messages"), {
      room_id: room_id,
      limit: limit,
      cursor: cursor
    }, FuxHTTP.RESOLVE_DATA, FuxHTTP.REJECT_MESSAGE);
  },
  getMediaContentUrl: function getMediaContentUrl(message_id) {
    return "".concat(WEB_SERVER_URL, "/ai-assistant/chat/get-media-content?message_id=").concat(message_id);
  },
  sendTextMessage: function sendTextMessage(room_id, text) {
    var attachments = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var assistant_specific_prompt = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var mode = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var formData = new FormData();
    formData.append("room_id", room_id);
    formData.append("text", text);
    if (mode) formData.append("mode", mode);
    if (assistant_specific_prompt) formData.append('assistant_specific_prompt', assistant_specific_prompt);
    if (attachments) {
      attachments.map(function (a) {
        formData.append("attachments[]", a);
      });
    }
    var xsrf_token = FuxHTTP.getCookie('XSRF-TOKEN');
    if (xsrf_token) formData.append('_token', xsrf_token);
    return new Promise(function (resolve, reject) {
      fetch("".concat(WEB_SERVER_URL, "/ai-assistant/chat/send-text-message"), {
        method: 'POST',
        body: formData
      }).then(function (response) {
        return response.json();
      }).then(function (json) {
        json.status === FuxHTTP.STATUS_SUCCESS ? resolve(json.data) : reject(json.message);
      })["catch"](function (m) {
        console.error(m);
        reject(null);
      });
    });
  }
};
//# sourceMappingURL=_User.js.map