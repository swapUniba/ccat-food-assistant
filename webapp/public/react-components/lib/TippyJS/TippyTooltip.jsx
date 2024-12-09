import {Portal} from "../../Portal/Portal";

export class TippyTooltip extends React.Component {

    constructor(props) {
        super(props);
        this.tippyInstance = null;
        this.contentDom = document.createElement('div');
    }
    
    componentWillUnmount() {
        if (this.tippyInstance) {
            this.tippyInstance.destroy();
        }
    }

    handleRef = node => {
        if (!node) return;
        if (this.tippyInstance) this.tippyInstance.destroy();
        this.tippyInstance = tippy(node, {
            content: this.contentDom,
            theme: 'light',
            allowHTML: this.props.allowHTML,
            arrow: this.props.arrow,
            interactive: this.props.interactive,
            placement: this.props.placement,
            trigger: this.props.trigger,
            offset: this.props.offset,
            appendTo: this.props.appendTo,
            sticky: this.props.sticky,
            showOnCreate: this.props.showOnCreate,
            hideOnClick: this.props.hideOnClick,
        });
    }

    render() {
        return (
            <React.Fragment>
                <span ref={this.handleRef}>
                    {this.props.children}
                </span>
                <Portal domNode={this.contentDom}>
                    {this.props.content}
                </Portal>
            </React.Fragment>
        );
    }
}

TippyTooltip.propTypes = {
    content: PropTypes.string,
    interactive: PropTypes.bool,
    allowHTML: PropTypes.bool,
    arrow: PropTypes.bool,
    placement: PropTypes.string,
    trigger: PropTypes.string,
    offset: PropTypes.arrayOf(PropTypes.number),
    appendTo: PropTypes.func,
    sticky: PropTypes.bool,
    showOnCreate: PropTypes.bool,
    hideOnClick: PropTypes.bool,
}

TippyTooltip.defaultProps = {
    placement: 'top',
    allowHTML: false,
    arrow: true,
    interactive: false,
    sticky: false,
    trigger: 'mouseenter focus',
    offset: [0, 0],
}