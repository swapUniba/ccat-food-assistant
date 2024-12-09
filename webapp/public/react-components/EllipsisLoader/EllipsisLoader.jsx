import {addCssToHead} from "../Helpers/CSSHelpers";

export function EllipsisLoader(props) {
    return <div className="lds-ellipsis">
        <div/>
        <div/>
        <div/>
        <div/>
    </div>
}


addCssToHead(//language=CSS
`
    .lds-ellipsis {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 20px;
    }
    .lds-ellipsis div {
        position: absolute;
        top: 5px;
        width: 13px;
        height: 13px;
        border-radius: 50%;
        animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    .lds-ellipsis div:nth-child(1) {
        left: 8px;
        animation: lds-ellipsis1 0.6s infinite;
        background: #93a0d7;
    }
    .lds-ellipsis div:nth-child(2) {
        left: 8px;
        animation: lds-ellipsis2 0.6s infinite;
        background: #5f68a9;
    }
    .lds-ellipsis div:nth-child(3) {
        left: 32px;
        animation: lds-ellipsis2 0.6s infinite;
        background: #293069;
    }
    .lds-ellipsis div:nth-child(4) {
        left: 56px;
        animation: lds-ellipsis3 0.6s infinite;
        background: #293069;
    }
    @keyframes lds-ellipsis1 {
        0% {
            transform: scale(0);
        }
        100% {
            transform: scale(1);
        }
    }
    @keyframes lds-ellipsis3 {
        0% {
            transform: scale(1);
        }
        100% {
            transform: scale(0);
        }
    }
    @keyframes lds-ellipsis2 {
        0% {
            transform: translate(0, 0);
        }
        100% {
            transform: translate(24px, 0);
        }
    }
`)