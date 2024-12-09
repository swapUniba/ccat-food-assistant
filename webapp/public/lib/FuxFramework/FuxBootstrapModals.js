const FuxBootstrapModals = {
    fire: function (options) {
        const basicOptions = {
            title: '',
            body: '',
            footer: '',
            bodyClassname: '',
            footerClassname: '',
            size: 'md', //sm, md, lg, xl (md is not valid, but stand for "default" size)
            showHeaderCloseButton: true,
            onDismiss: null,
            alignVCenter: false,
            bodyScollable: false,
            modalId: `fux_bs_modal_${(Math.random() * 99999).toFixed(0)}`,
            animation: true,
            onRender: null
        }

        const modal = __FuxBsModal(Object.assign(basicOptions, options));
        if (options.onRender) options.onRender(modal.getElement());
        document.body.appendChild(modal.getElement());
        modal.show();
        return modal;
    }
}

function __FuxBsModal(options) {
    const element = document.createElement('div');
    element.className = `modal fuxBootstrapModal ${options.animation ? 'fade' : ''}`;
    element.id = options.modalId;
    element.setAttribute('role', 'dialog');

    let dialogClassNames = `modal-${options.size}`;
    if (options.alignVCenter) dialogClassNames += " modal-dialog-centered";
    if (options.bodyScollable) dialogClassNames += " modal-dialog-scrollable";

    element.innerHTML = `
      <div class="modal-dialog modal-${options.size} ${dialogClassNames}" role="document">
        <div class="modal-content">
          <div class="modal-header ${!options.title && !options.showHeaderCloseButton ? 'd-none' : ''}">
            <h5 class="modal-title"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    `;

    const title = element.querySelector('.modal-title');
    const headerCloseBtn = element.querySelector('.modal-header .close');
    const body = element.querySelector('.modal-body');
    const footer = element.querySelector('.modal-footer');

    const appendChildOrSetHtml = function (content, element) {
        if (content instanceof Element || content instanceof HTMLDocument) {
            element.appendChild(content);
        } else {
            element.innerHTML = content;
        }
    }


    appendChildOrSetHtml(options.title, title);
    appendChildOrSetHtml(options.body, body);
    if (options.footer) appendChildOrSetHtml(options.footer, footer);
    if (!options.footer) footer.parentElement.removeChild(footer);
    if (!options.showHeaderCloseButton) headerCloseBtn.parentElement.removeChild(headerCloseBtn);
    if (options.bodyClassname) body.className = `${body.className} ${options.bodyClassname}`
    if (options.footerClassname) footer.className = `${footer.className} ${options.footerClassname}`

    let preserveOnClose = false;

    $(element).on('hidden.bs.modal', function (e) {
        if (options.onDismiss) {
            options.onDismiss(preserveOnClose);
        } else {
            if (!preserveOnClose) document.body.removeChild(element);
        }
        preserveOnClose = false;
    });

    return {
        getElement: _ => element,
        show: _ => $(element).modal('show'),
        close: preserve => {
            preserveOnClose = !!preserve;
            $(element).modal('hide');
        },
        destroy: _ => document.body.removeChild(element)
    }
}



