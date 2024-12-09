var _excluded = ["isMine", "isLast", "messageData"];
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var s = Object.getOwnPropertySymbols(e); for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.includes(n)) continue; t[n] = r[n]; } return t; }
import React from "react";
import PropTypes from "prop-types";
import { FaSolidIcon } from "../../../FontAwesome/FontAwesome";
import { SafeHtmlContainer } from "../../../SafeHtmlContainer/SafeHtmlContainer";
export function TextMessage(_ref) {
  var _messageData$metadata;
  var isMine = _ref.isMine,
    isLast = _ref.isLast,
    messageData = _ref.messageData,
    props = _objectWithoutProperties(_ref, _excluded);
  var sendTime = moment(messageData.created_at).format('HH:mm');
  function urlify(text) {
    var urlRegex = /\s?(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex " + (isMine ? 'justify-content-end mine' : 'yours')
  }, /*#__PURE__*/React.createElement("div", {
    className: "message " + (isLast ? 'last' : '')
  }, /*#__PURE__*/React.createElement(SafeHtmlContainer, {
    html: urlify(messageData.content)
  }), props.widget, /*#__PURE__*/React.createElement("div", {
    className: "metadata"
  }, !!((_messageData$metadata = messageData.metadata) !== null && _messageData$metadata !== void 0 && _messageData$metadata.active_form) && /*#__PURE__*/React.createElement("span", {
    className: "bg-info rounded px-1 me-2"
  }, messageData.metadata.active_form), sendTime, "\xA0", isMine && /*#__PURE__*/React.createElement(FaSolidIcon, {
    name: messageData.is_read === '1' ? 'check-double' : 'check'
  })))));
}
TextMessage.propTypes = {
  isMine: PropTypes.bool,
  isLast: PropTypes.bool,
  messageData: PropTypes.object.isRequired,
  widget: PropTypes.element
};
//# sourceMappingURL=TextMessage.js.map