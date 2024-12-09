import React from "react";
import PropTypes from "prop-types";
import {addCssToHead} from "../Helpers/CSSHelpers";

addCssToHead(`
.fas[data-badge], .far[data-badge], .fab[data-badge] {
    position: relative;
}

[data-badge]:after {
    display: block;
    position: absolute;
    top: -7px;
    right: -14px;
    content: attr(data-badge);
    border-radius: 500px;
    background: tomato;
    color: #ffffff;
    width: 17px;
    height: 17px;
    font-size: 11px;
    text-align: center;
    line-height: 17px;
    font-family: sans-serif;
}

[data-badge].fa-badge-left:after {
    right: initial;
    left: -14px;
}
`)

function FaIcon(props) {
    let classNames = "";
    if (props.badgeSide) classNames += ` fa-badge-${props.badgeSide}`;
    if (props.badgeColor) classNames += ` fa-badge-${props.badgeColor}`;

    return (
        <i style={props.style}
           className={`${props.type} fa-${props.name} fa-${props.size}x ${classNames} ${props.className}`}
           data-badge={props.badge} data-badge-small={props.badgeSmall}> </i>
    )
}


export function FaSolidIcon(props) {
    return (
        <FaIcon type={"fas"} {...props} />
    )
}

export function FaRegularIcon(props) {
    return (
        <FaIcon type={"far"} {...props} />
    )
}

export function FaBrandIcon(props) {
    return (
        <FaIcon type={"fab"} {...props} />
    )
}
