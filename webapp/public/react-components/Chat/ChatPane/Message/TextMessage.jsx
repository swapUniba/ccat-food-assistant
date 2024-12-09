import React from "react";
import PropTypes from "prop-types";
import {FaSolidIcon} from "../../../FontAwesome/FontAwesome";
import {SafeHtmlContainer} from "../../../SafeHtmlContainer/SafeHtmlContainer";

export function TextMessage({isMine, isLast, messageData, ...props}) {
    const sendTime = moment(messageData.created_at).format('HH:mm');

    function urlify(text) {
        var urlRegex = /\s?(https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function (url) {
            return '<a href="' + url + '" target="_blank">' + url + '</a>';
        });
    }

    return (
        <React.Fragment>
            <div className={"d-flex " + (isMine ? 'justify-content-end mine' : 'yours')}>
                <div className={"message " + (isLast ? 'last' : '')}>
                    <SafeHtmlContainer html={urlify(messageData.content)}/>
                    {props.widget}
                    <div className={"metadata"}>
                        {
                            !!messageData.metadata?.active_form &&
                            <span className={"bg-info rounded px-1 me-2"}>{messageData.metadata.active_form}</span>
                        }
                        {sendTime}&nbsp;
                        {
                            isMine &&
                            <FaSolidIcon name={messageData.is_read === '1' ? 'check-double' : 'check'}/>
                        }
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}


TextMessage.propTypes = {
    isMine: PropTypes.bool,
    isLast: PropTypes.bool,
    messageData: PropTypes.object.isRequired,
    widget: PropTypes.element
}
