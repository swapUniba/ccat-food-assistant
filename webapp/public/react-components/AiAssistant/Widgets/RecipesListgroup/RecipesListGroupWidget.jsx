import React from "react";
import PropTypes from "prop-types";
import {RecipesListGroupWidgetItem} from "./RecipesListGroupWidgetItem";

export class RecipesListGroupWidget extends React.Component {

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
        if (this.props.widget.return) {
            this.props.onGeneratedPrompt(`Hai scelto: ${data['name']}`, `User selected ${this.props.widget.return} = ${data[this.props.widget.return]}, ${data['name']}`);
        } else if (data.url) {
            window.open(data.url);
        }
    }

    render() {
        const widget = this.props.widget;
        return (
            <div className={"list-group list-group-flush my-3"}>
                {
                    widget.data.map(item => <RecipesListGroupWidgetItem
                            data={item}
                            onChoose={this.handleChoose}
                        />
                    )
                }
            </div>
        )
    }

}

RecipesListGroupWidget.propTypes = {
    widget: PropTypes.shape({
        data: PropTypes.arrayOf(PropTypes.object),
        type: PropTypes.string,
        semtype: PropTypes.string,
        return: PropTypes.string,
        label: PropTypes.string,
    }),
    onGeneratedPrompt: PropTypes.func
}
