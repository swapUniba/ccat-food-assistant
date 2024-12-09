import React from "react";
import PropTypes from "prop-types";
import {FaSolidIcon} from "../../FontAwesome/FontAwesome";
import {ChatRoomMessage} from "./Message/ChatRoomMessage";

const WrapperStyle = {
    backgroundColor: "#dadde1",
    maxHeight: 'calc(100vh - 116px )'
}

const MESSAGE_FETCH_LIMIT = 20;
const CHAT_UPDATE_MESSAGES = 'CHAT_UPDATE_MESSAGES';
export const CHAT_SCROLL_TO_BOTTOM = 'CHAT_SCROLL_TO_BOTTOM';
export var CHAT_READ_EVT = 'CHAT_READ_EVT';
export var NEW_CHAT_MESSAGE_EVT = 'NEW_CHAT_MESSAGE_EVT';

export class ChatRoomView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            messages: [],
            afterCursor: null,
            beforeCursor: null,
            sendingMessage: false,
            isRecording: false,
        }

        this.inputRef = React.createRef();
        this.scrollPaneRef = React.createRef();
        this.shouldUpdateMessageList = true;
    }

    componentDidMount() {
        FuxEvents.on(this.props.fetchMessageEventName, this.handleExternalNewMessage);
        FuxEvents.on(CHAT_UPDATE_MESSAGES, this.handleUpdateMessages);
        FuxEvents.on(CHAT_SCROLL_TO_BOTTOM, this.scrollToBottom);
        FuxEvents.on('__chat_message__', this.handleExternalTextMessage);
        this.fetchInitialMessages(MESSAGE_FETCH_LIMIT);
        this.fetchNewMessagesLoop()
    }

    componentWillUnmount() {
        FuxEvents.off(this.props.fetchMessageEventName, this.handleExternalNewMessage);
        FuxEvents.off(CHAT_UPDATE_MESSAGES, this.handleUpdateMessages);
        FuxEvents.off(CHAT_SCROLL_TO_BOTTOM, this.scrollToBottom);
        FuxEvents.off('__chat_message__', this.handleExternalTextMessage);
        this.shouldUpdateMessageList = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        //Riposiziona lo scroll del div alla posizione originale prima di aver preso messaggi più vecchi
        if (this.oldScroll !== null && this.curScrollPos !== null) {
            this.restoreScrollPoint();
        }
    }

    fetchNewMessagesLoop = _ => {
        if (this.shouldUpdateMessageList) {
            setTimeout(_ => {
                this.fetchNewMessages(false, this.fetchNewMessagesLoop);
            }, 3000);
        }
    }

    handleUpdateMessages = id_chat_room => {
        if (id_chat_room === this.props.roomId) {
            this.fetchInitialMessages(this.state.messages.length);
        }
    }

    handleInputChange = ({target}) => {
        if (this.state.sendingMessage) return;
        this.setState({[target.name]: target.value});
    }
    handleExternalTextMessage = (msg) => this.setState({text: msg});

    fetchInitialMessages = messagesNum => {
        this.props.getMessageAPI(this.props.roomId, messagesNum, null)
            .then(data => {
                this.setState({
                    messages: data.messages.reverse(),
                    afterCursor: data.cursors.after,
                    beforeCursor: data.cursors.before,
                }, this.scrollToBottom);
            });
    }

    fetchNewMessages = (silent, onStateUpdate) => {
        return this.props.getMessageAPI(this.props.roomId, MESSAGE_FETCH_LIMIT, this.state.afterCursor)
            .then(data => {
                if (data.messages.length) {
                    const newMessagesList = [...this.state.messages];
                    data.messages.reverse().map(m => {
                        if (!newMessagesList.find(mm => mm.message_id === m.message_id)) newMessagesList.push(m)
                    })
                    this.setState({
                        messages: newMessagesList,
                        afterCursor: data.cursors.after, //Aggiorno solo il cursore after
                    }, _ => {
                        if (!silent) this.scrollToBottom();
                        if (onStateUpdate) onStateUpdate();
                        if (this.props.setReadAPI) this.props.setReadAPI(this.props.roomId).then(_ => FuxEvents.emit(CHAT_READ_EVT));
                    });
                } else {
                    if (onStateUpdate) onStateUpdate();
                }
            });
    }

    fetchOldMessages = _ => {
        return this.props.getMessageAPI(this.props.roomId, MESSAGE_FETCH_LIMIT, this.state.beforeCursor)
            .then(data => {
                this.saveScrollPoint();
                const newMessagesList = [...data.messages.reverse()];
                this.state.messages.map(m => {
                    if (!newMessagesList.find(mm => mm.message_id === m.message_id)) newMessagesList.push(m)
                });
                this.setState({
                    messages: newMessagesList,
                    beforeCursor: data.cursors.before, //Aggiorno solo il cursore after
                });
            });
    }

    handleInputFormSubmit = e => {
        e.preventDefault();
        this.handleSendMessage();
    }

    handleSendMessage = _ => {
        this.sendMessage(this.state.text);
    }

    sendMessage = (text) => {
        this.setState({sendingMessage: true});
        this.inputRef.current.focus();
        this.props.sendMessageAPI(this.props.roomId, text)
            .then(({message_id, otp}) => {
                if (this.props.sendNotificationAPI) this.props.sendNotificationAPI(this.props.roomId, message_id, otp);
                this.fetchNewMessages()
                    .then(_ => {
                        this.setState({
                            sendingMessage: false,
                            text: '',
                        });
                    });
            })
            .catch(message => {
                FuxSwalUtility.error(message);
                this.setState({sendingMessage: false});
            });
    }

    sendInitialMessage = _ => this.sendMessage("Ciao!");

    handleExternalNewMessage = room_id => {
        if (room_id === this.props.roomId) {
            this.fetchNewMessages(false, _ => {
                const messageList = this.state.messages.slice().map(m => {
                    m.is_read = "1";
                    return m;
                });
                this.setState({messages: messageList});
            });
            if (this.props.setReadAPI) this.props.setReadAPI(this.props.roomId);
        }
    }

    /** @MARK: Scroll utilities */

    scrollToBottom = _ => {
        if (this.scrollPaneRef.current) {
            this.scrollPaneRef.current.scrollTop = this.scrollPaneRef.current.scrollHeight;
        }
    }

    saveScrollPoint = _ => {
        if (this.scrollPaneRef.current) {
            this.curScrollPos = this.scrollPaneRef.current.scrollTop;
            this.oldScroll = this.scrollPaneRef.current.scrollHeight - this.scrollPaneRef.current.clientHeight;
        }
    }

    restoreScrollPoint = _ => {
        if (this.oldScroll !== null && this.curScrollPos !== null) {
            const newScroll = this.scrollPaneRef.current.scrollHeight - this.scrollPaneRef.current.clientHeight;
            this.scrollPaneRef.current.scrollTop = this.curScrollPos + (newScroll - this.oldScroll);
            this.oldScroll = null;
            this.curScrollPos = null;
        }
    }


    render() {
        return (
            <div className={"d-flex flex-column h-100"} style={WrapperStyle}>
                <div className={"px-3 overflow-auto py-4 flex-grow-1"} ref={this.scrollPaneRef}>
                    {
                        !this.state.messages.length &&
                        <p className={"w-75 mx-auto text-center lead"}>
                            Inizia la tua conversazione, invia un saluto a Italo! <br/>
                            <button className={"btn btn-primary"} onClick={this.sendInitialMessage}>Ciao! 👋🏻</button>
                        </p>
                    }
                    {
                        !!this.state.beforeCursor &&
                        <div className={"text-center"} onClick={this.fetchOldMessages}>
                            <button className={"btn btn-sm btn-link text-primary"}>
                                Carica messaggi precedenti
                            </button>
                        </div>
                    }
                    {
                        this.state.messages.map((m, i) => {
                            const prevMessage = i === 0 ? null : this.state.messages[i - 1];
                            const nextMessage = i === this.state.messages.length - 1 ? null : this.state.messages[i + 1];
                            const isLast = !nextMessage || nextMessage.sender_id !== m.sender_id;

                            const showOwnDate = !prevMessage || moment(prevMessage.created_at).format('DD-MM-YYYY') !== moment(m.created_at).format('DD-MM-YYYY');
                            const messageData = this.props.messageProcessor ? this.props.messageProcessor(m) : m;
                            const widget = this.props.messageWidgetRenderer ? this.props.messageWidgetRenderer(m, i == this.state.messages.length - 1) : null;
                            return <ChatRoomMessage
                                key={m.message_id}
                                messageData={messageData}
                                idSelf={this.props.idSelf}
                                isLast={isLast}
                                showOwnDate={showOwnDate}
                                getMediaContentUrlAPI={this.props.getMediaContentUrlAPI}
                                widget={widget}
                            />
                        })
                    }
                    {this.props.messageListFooter}
                </div>
                <div className={"bg-white shadow-sm p-2 border-top " + (!this.state.messages.length && 'd-none')}>
                    <div className={"d-flex align-items-center"}>
                        <form onSubmit={this.handleInputFormSubmit}
                              className={this.state.isRecording ? 'd-none' : 'flex-grow-1'}>
                            <div className={"d-flex align-items-center"}>
                                <input
                                    ref={this.inputRef}
                                    className={"form-control rounded-pill"}
                                    type={"text"}
                                    name={"text"}
                                    autoComplete={"off"}
                                    value={this.state.text}
                                    onChange={this.handleInputChange}
                                    onSubmit={this.handleSendMessage}
                                    placeholder={"Scrivi un messaggio"}
                                />
                                <div>
                                    <button style={{width: 38, height: 38}}
                                            className={"btn btn-primary rounded-circle d-flex align-items-center justify-content-center ml-2"}
                                            disabled={!this.state.text || this.state.sendingMessage || this.props.disableSend}
                                            onClick={this.handleSendMessage}>
                                        {
                                            this.state.sendingMessage ?
                                                <FaSolidIcon name={"spin"} className={"fa-spinner"}/>
                                                :
                                                <FaSolidIcon name={"paper-plane"}/>
                                        }
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }

}

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
    disableSend: PropTypes.bool,
}

ChatRoomView.defaultProps = {
    showAudioRecordingButton: true,
    showAttachmentsButton: true,
    disableSend: false,
}

