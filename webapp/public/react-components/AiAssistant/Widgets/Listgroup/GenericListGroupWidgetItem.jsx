import React from "react";
import PropTypes from "prop-types";
import {FaSolidIcon} from "../../../FontAwesome/FontAwesome";

export class GenericListGroupWidgetItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    handleClick = _ => this.props.onChoose(this.props.data);

    render() {
        const label = this.props.data[this.props.label];
        return (
            <div className={`list-group-item ${this.props.disabled ? 'text-muted' : 'cursor-pointer'}`}
                 onClick={this.handleClick}>
                <div className={"d-flex w-100 align-items-center justify-content-between"}>
                    {label}
                    <FaSolidIcon name={"chevron-right"}/>
                </div>
            </div>
        )
    }

}

GenericListGroupWidgetItem.propTypes = {
    data: PropTypes.object,
    label: PropTypes.string,
    onChoose: PropTypes.func,
    disabled: PropTypes.bool
}
