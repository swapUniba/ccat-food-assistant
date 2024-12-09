import React from "react";
import PropTypes from "prop-types";
import {ButtonsListWidgetItem} from "./ButtonsListWidgetItem";

export class ButtonsListWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    /**
     * When an item of the list is selected two prompts are generated:
     * - frontend prompt: which is the one that will be displayed to the user
     * - backend prompt: which is the one that will be used to generate a new response on the llm/assistant side
     * */
    handleClick = data => {
        if (this.props.disabled) return;
        this.props.onGeneratedPrompt(data.label, data.return);
    }

    render() {
        const widget = this.props.widget;
        return (
            <div className={"list-group list-group-flush my-3"}>
                {
                    widget.data.map(item => <ButtonsListWidgetItem
                        disabled={this.props.disabled}
                        onClick={this.handleClick}
                        data={item}
                    />)
                }
            </div>
        )
    }

}

ButtonsListWidget.propTypes = {
    widget: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.object),
        type: PropTypes.string,
        semtype: PropTypes.string,
        return: PropTypes.string,
        label: PropTypes.string,
    }),
    onGeneratedPrompt: PropTypes.func,
    disabled: PropTypes.bool
}
