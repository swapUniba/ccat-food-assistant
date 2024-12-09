import React from "react";
import PropTypes from "prop-types";
import {TextMessage} from "./TextMessage";
import './ChatRoomMessage.css'

const MessageMetadataStyle = {
    fontSize: '0.6rem'
}

export class ChatRoomMessage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    isMine = _ => parseInt(this.props.messageData.sender_id) === parseInt(this.props.idSelf);

    getMessageComponent = ({type, metadata}) => {
        switch (type) {
            case 'text':
            case 'auto':
                return TextMessage;
            default:
                return React.Fragment;
        }
    }

    render() {
        const sendDate = moment(this.props.messageData.created_at).format('ddd D MMM');
        const isMine = this.isMine();
        const Message = this.getMessageComponent(this.props.messageData);
        return (
            <React.Fragment>
                {
                    this.props.showOwnDate &&
                    <div className={"d-flex justify-content-center my-3"}>
                        <div className={"d-inline-block bg-white small px-2 py-1 text-capitalize rounded shadow-sm"}>
                            {sendDate}
                        </div>
                    </div>
                }
                <Message
                    isMine={isMine}
                    isLast={this.props.isLast}
                    messageData={this.props.messageData}
                    getMediaContentUrlAPI={this.props.getMediaContentUrlAPI}
                    widget={this.props.widget}
                />
            </React.Fragment>
        )
    }

}

ChatRoomMessage.propTypes = {
    messageData: PropTypes.object.isRequired,
    idSelf: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isLast: PropTypes.bool.isRequired,
    showOwnDate: PropTypes.bool,
    getMediaContentUrlAPI: PropTypes.func.isRequired,
    widget: PropTypes.element
}
