import React from "react";
import PropTypes from "prop-types";

export class AiAssistantSpeechRecognitionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            recognizing: false,
        }
    }

    handleStart = _ => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Sembra che non sia possibile avviare il riconoscimento della voce su questo dispositivo');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = this.props.lang;

        recognition.onstart = () => {
            this.setState({recognizing: true});
            if (this.props.onRecognitionStart) this.props.onRecognitionStart();
        };

        recognition.onend = () => {
            this.setState({recognizing: false});
            if (this.props.onRecognitionEnd) this.props.onRecognitionEnd();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.setState({recognizing: false});
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.props.onTextRecognition(transcript);
        };

        recognition.start();
    }



    render() {
        return (
            <button className={this.props.className} style={this.props.style} onClick={this.handleStart}
                    disabled={this.state.recognizing} type={"button"}>
                {this.props.children}
            </button>
        );
    }
}

AiAssistantSpeechRecognitionButton.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string,
    style: PropTypes.object,
    onTextRecognition: PropTypes.func,
    onRecognitionEnd: PropTypes.func,
    onRecognitionStart: PropTypes.func,
    lang: PropTypes.string
}
