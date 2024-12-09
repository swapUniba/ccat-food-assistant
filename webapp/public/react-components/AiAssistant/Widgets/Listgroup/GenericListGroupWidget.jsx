import React from "react";
import PropTypes from "prop-types";
import {GenericListGroupWidgetItem} from "./GenericListGroupWidgetItem";

export class GenericListGroupWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }


    /**
     * When an item of the list is selected two prompts are generated:
     * - frontend prompt: which is the one that will be displayed to the user
     * - backend prompt: which is the one that will be used to generate a new response on the llm/assistant side
     * */
    handleChoose = data => {
        if (this.props.disabled) return;
        this.props.onGeneratedPrompt(data[this.props.widget.label], `${this.props.widget.return} = ${data[this.props.widget.return]}`);
    }

    render() {
        const widget = this.props.widget;
        return (
            <div className={"list-group list-group-flush my-3"}>
                {
                    widget.data.map(item => <GenericListGroupWidgetItem
                        disabled={this.props.disabled}
                        data={item}
                        label={widget.label}
                        onChoose={this.handleChoose}/>
                    )
                }
            </div>
        )
    }

}

GenericListGroupWidget.propTypes = {
    widget: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.object),
        type: PropTypes.string,
        semtype: PropTypes.string,
        return: PropTypes.string,
        label: PropTypes.string,
    }),
    disabled: PropTypes.bool,
    onGeneratedPrompt: PropTypes.func
}
