import React from "react";
import PropTypes from "prop-types";
import {addCssToHead} from "../../Helpers/CSSHelpers";


addCssToHead(//language=CSS
`
    .dot-typing-loader-container {
        align-items: center;
        display: flex;
        justify-content: center;
        gap: 0.30rem;
        border-radius: 9999px;
        padding: .5rem;
    }
    .dot-typing-loader-container .dot {
        border-radius: 9999px;
        height: 0.7rem;
        width: 0.7rem;
    
        background: rgba(148 163 184 / 1);
        animation: dot-typing-loader-container-wave 1s infinite;
    }

    .dot-typing-loader-container .dot:nth-child(1) {
        animation-delay: 0.3333s;
    }
    .dot-typing-loader-container .dot:nth-child(2) {
        animation-delay: 0.6666s;
    }
    .dot-typing-loader-container .dot:nth-child(3) {
        animation-delay: 0.9999s;
    }
    
    @keyframes dot-typing-loader-container-wave {
        0% {
            transform: translateY(0px);
            background: rgba(148 163 184 / 0);
        }
        50% {
            transform: translateY(-0.5rem);
            background: rgba(148 163 184 / 0.8);
        }
        100% {
            transform: translateY(0px);
            background: rgba(148 163 184 / 0);
        }
    }
`)

export function DotTypingLoader(props) {
    return (
        <React.Fragment>
            <div className="dot-typing-loader-container">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
            </div>
        </React.Fragment>
    )
}

DotTypingLoader.propTypes = {}
