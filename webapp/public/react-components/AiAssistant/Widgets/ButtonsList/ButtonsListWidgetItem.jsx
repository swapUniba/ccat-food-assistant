import React from "react";
import PropTypes from "prop-types";

export class ButtonsListWidgetItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    handleClick = _ => this.props.onClick(this.props.data);

    render() {
        return (
            <button className={"btn btn-outline-secondary btn-sm"} disabled={this.props.disabled} onClick={this.handleClick}>
                {this.props.data.label}
            </button>
        )
    }

}

ButtonsListWidgetItem.propTypes = {
    data: PropTypes.shape({
        label: PropTypes.string,
        return: PropTypes.string
    }),
    onClick: PropTypes.func,
    disabled: PropTypes.bool
}
