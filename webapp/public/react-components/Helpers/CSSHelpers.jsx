export function addCssToHead(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
}