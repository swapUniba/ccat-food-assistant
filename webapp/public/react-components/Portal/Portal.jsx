export class Portal extends React.Component{
    render(){
        return ReactDOM.createPortal(
            this.props.children,
            this.props.domNode
        )
    }
}

Portal.propTypes = {
    domNode: `PropTypes.element`
}