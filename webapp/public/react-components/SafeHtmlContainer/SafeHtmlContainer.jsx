const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'u', 'br', 'font', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'style', 'color', 'target']
};

const sanitize = (dirty, options) => ({
    __html: DOMPurify.sanitize(
        dirty,
        {...defaultOptions, ...options}
    )
});

export const SafeHtmlContainer = ({html, options}) => (
    <span dangerouslySetInnerHTML={sanitize(html, options)}/>
);
