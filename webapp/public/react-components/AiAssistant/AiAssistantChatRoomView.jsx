import React from "react";
import PropTypes from "prop-types";
import {NEW_CHAT_MESSAGE_EVT, ChatRoomView} from "../Chat/ChatPane/ChatRoomView";
import {AiAssistantAPI} from "../API/AiAssistant/AiAssistantAPI";
import {GenericListGroupWidget} from "./Widgets/Listgroup/GenericListGroupWidget";
import {ButtonsListWidget} from "./Widgets/ButtonsList/ButtonsListWidget";
import {DotTypingLoader} from "../BaseComponents/DotTypingLoader/DotTypingLoader";
import {AiAssistantChatRoomTextBox, ASSISTANT_MODE_DECLARATIVE} from "./AiAssistantChatRoomTextBox";
import {
    RecipesListGroupWidget
} from "../../react-components-dist/AiAssistant/Widgets/RecipesListgroup/RecipesListGroupWidget";


const ASSISTANT_MODE_LOCAL_STORAGE_KEY = '__AI_ASSISTANT_MODE';

export class AiAssistantChatRoomView extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            assistantAnswered: true,
            assistantMode: ''
        }

        this.textBoxComponent = AiAssistantChatRoomTextBox(this.handleModeChange, localStorage.getItem(ASSISTANT_MODE_LOCAL_STORAGE_KEY));
    }

    doNothing = _ => {
    }

    handleModeChange = mode => this.setState({assistantMode: mode}, _ => {
        localStorage.setItem(ASSISTANT_MODE_LOCAL_STORAGE_KEY, mode);
    });

    /**
     * This function is used as wrapper around the basic api for retrieving messages with the AI assistant. It allow
     * us to get information about the message list and return back to the caller the results in a transparent way.
     * */
    getMessageAPIGateway = (room_id, limit, cursor) => {
        return new Promise((resolve, reject) => {
            AiAssistantAPI.User.getMessages(room_id, limit, cursor)
                .then(data => {
                    if (data.messages.length) {
                        this.setState({assistantAnswered: data.messages[0].sender_id != this.props.idSelf});
                    }
                    resolve(data);
                }).catch(reject);
        })
    }

    processMessageData = m => ({...m, content: m.content.replace(new RegExp('\{\{widget\}\}', 'g'), '')});

    widgetRenderer = (m, isLastMessage) => {
        if (m.content.indexOf('{{widget}}') == -1) return '';
        if (!m.metadata.widgets || !m.metadata.widgets.length) return '';

        return m.metadata.widgets.map(widget => {
            switch (widget.type) {
                case 'list-group':
                case 'custom-list-group':
                    switch (widget.semtype) {
                        case 'recipes':
                            return <RecipesListGroupWidget widget={widget} onGeneratedPrompt={this.handleWidgetGeneratedPrompt}/>
                        default:
                            return <GenericListGroupWidget widget={widget} disabled={!isLastMessage}
                                                           onGeneratedPrompt={this.handleWidgetGeneratedPrompt}/>
                    }
                case 'buttons-list':
                    return <ButtonsListWidget widget={widget} disabled={!isLastMessage}
                                              onGeneratedPrompt={this.handleWidgetGeneratedPrompt}
                    />
            }
        });
    }

    handleWidgetGeneratedPrompt = (frontendPrompt, backendPrompt) => {
        AiAssistantAPI.User.sendTextMessage(this.props.roomId, frontendPrompt, [], backendPrompt)
            .then(_ => FuxEvents.emit(NEW_CHAT_MESSAGE_EVT, this.props.roomId));
    }

    getMessageListFooter = _ => {
        if (this.state.assistantAnswered) return '';

        return <div className={"d-flex yours"}>
            <div className={"message last"}>
                <DotTypingLoader/>
            </div>
        </div>
    }

    sendMessageProxyAPI = (room_id, text, attachments, assistant_specific_prompt) => AiAssistantAPI.User.sendTextMessage(room_id, text, attachments, assistant_specific_prompt, this.state.assistantMode)

    render() {


        return (
            <React.Fragment>
                <ChatRoomView
                    roomId={this.props.roomId}
                    idSelf={this.props.idSelf}
                    getMessageAPI={this.getMessageAPIGateway}
                    getMediaContentUrlAPI={AiAssistantAPI.User.getMediaContentUrl}
                    sendMessageAPI={this.sendMessageProxyAPI}
                    setReadAPI={null}
                    sendNotificationAPI={null}
                    fetchMessageEventName={NEW_CHAT_MESSAGE_EVT}
                    showAudioRecordingButton={false}
                    showAttachmentsButton={false}
                    messageProcessor={this.processMessageData}
                    messageWidgetRenderer={this.widgetRenderer}
                    messageListFooter={this.getMessageListFooter()}
                    textBoxComponent={this.textBoxComponent}
                    disableSend={!this.state.assistantAnswered}
                />
            </React.Fragment>
        )
    }

}

AiAssistantChatRoomView.propTypes = {
    roomId: PropTypes.any,
    idSelf: PropTypes.any
}
