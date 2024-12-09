import React from "react";
import PropTypes from "prop-types";
import {FaSolidIcon} from "../../../FontAwesome/FontAwesome";
addCssToHead(`
.cursor-pointer{
    cursor:pointer;
}

.recipe-thumbnail{
    background-size:cover;
    background-position:center center;
    width:50px;
    height:50px;
}

@media (min-width: 768px){
    .recipe-thumbnail{
        width:100px;
        height:100px;
    }
}
`)
export class RecipesListGroupWidgetItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.imageStyle = {
            backgroundImage: `url('${this.props.data['image_url']}')`,
        }
    }

    handleClick = _ => this.props.onChoose(this.props.data);

    render() {
        return (
            <div className={`list-group-item cursor-pointer`}
                 onClick={this.handleClick}>
                <div className={"d-flex w-100 align-items-center justify-content-between"}>
                    <div className={"d-flex align-items-start"}>
                        {!!this.props.data['image_url'] && <div style={this.imageStyle} className={"me-3 rounded flex-shrink-0 recipe-thumbnail"}/>}
                        <div>
                            <b>{this.props.data['name']}</b>
                            <div className={"text-muted small"}>Ingredienti: {this.props.data['ingredients'].join(', ')}</div>
                        </div>
                    </div>
                    <FaSolidIcon name={"chevron-right"} className={"ms-3"}/>
                </div>
            </div>
        )
    }

}

RecipesListGroupWidgetItem.propTypes = {
    data: PropTypes.object,
    onChoose: PropTypes.func,
}
