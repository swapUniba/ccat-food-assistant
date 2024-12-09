import React from "react";
import PropTypes from "prop-types";
import { addCssToHead } from "../../Helpers/CSSHelpers";
addCssToHead(//language=CSS
"\n    .dot-typing-loader-container {\n        align-items: center;\n        display: flex;\n        justify-content: center;\n        gap: 0.30rem;\n        border-radius: 9999px;\n        padding: .5rem;\n    }\n    .dot-typing-loader-container .dot {\n        border-radius: 9999px;\n        height: 0.7rem;\n        width: 0.7rem;\n    \n        background: rgba(148 163 184 / 1);\n        animation: dot-typing-loader-container-wave 1s infinite;\n    }\n\n    .dot-typing-loader-container .dot:nth-child(1) {\n        animation-delay: 0.3333s;\n    }\n    .dot-typing-loader-container .dot:nth-child(2) {\n        animation-delay: 0.6666s;\n    }\n    .dot-typing-loader-container .dot:nth-child(3) {\n        animation-delay: 0.9999s;\n    }\n    \n    @keyframes dot-typing-loader-container-wave {\n        0% {\n            transform: translateY(0px);\n            background: rgba(148 163 184 / 0);\n        }\n        50% {\n            transform: translateY(-0.5rem);\n            background: rgba(148 163 184 / 0.8);\n        }\n        100% {\n            transform: translateY(0px);\n            background: rgba(148 163 184 / 0);\n        }\n    }\n");
export function DotTypingLoader(props) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "dot-typing-loader-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dot"
  }), /*#__PURE__*/React.createElement("div", {
    className: "dot"
  })));
}
DotTypingLoader.propTypes = {};
//# sourceMappingURL=DotTypingLoader.js.map