import React from "react";
import {FaSolidIcon} from "../FontAwesome/FontAwesome";
import {AiAssistantSpeechRecognitionButton} from "./AiAssistantSpeechRecognitionButton";

export const ASSISTANT_MODE_PROCEDURAL = 'PROCEDURAL';
export const ASSISTANT_MODE_DECLARATIVE = 'DECLARATIVE';

const ASSISTANT_MODES = [
    {
        value: ASSISTANT_MODE_PROCEDURAL,
        label: <span><FaSolidIcon name={"robot"}/> Fai eseguire un'azione a Genny</span>
    },
    {
        value: ASSISTANT_MODE_DECLARATIVE,
        label: <span><FaSolidIcon name={"question"}/> Fai delle domande a Genny</span>
    },
]


export function AiAssistantChatRoomTextBox(onModeChange, initialMode) {
    return function (props) {

        const modeBtnStyle = {
            width: 40,
            height: 40,
        }

        const [mode, setMode] = React.useState(initialMode || ASSISTANT_MODE_DECLARATIVE);

        const handleModeChange = newMode => {
            initialMode = mode;
            setMode(newMode);
            onModeChange(newMode);
        }

        const handleTextRecognition = text => {
            if (props.onRef && props.onRef.current) {
                let oldValue = props.onRef.current.value;
                props.onRef.current.value = oldValue ? oldValue + ' ' + text : text;
                props.onChange({target: props.onRef.current});
                if (props.onSubmit) props.onSubmit();
            }
        }

        return <React.Fragment>
            <div className={"flex-grow-1"}>
                <div className={"d-flex align-items-center border rounded-pill py-1 pl-1 pr-2"}>
                    <input ref={props.onRef} {...props} className={"form-control rounded-0 border-0"}
                           placeholder={"Write something to Italo"}/>
                    <AiAssistantSpeechRecognitionButton className={"btn btn-link text-muted"} lang={'it-IT'}
                                                        onTextRecognition={handleTextRecognition} type={"button"}>
                        <FaSolidIcon name={"microphone"}/>
                    </AiAssistantSpeechRecognitionButton>
                </div>
            </div>
        </React.Fragment>

    }
}


