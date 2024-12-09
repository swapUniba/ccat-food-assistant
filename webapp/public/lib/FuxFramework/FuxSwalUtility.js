const FuxSwalUtility = {
    success: function (message) {
        return swal({type: 'success', html: message});
    },
    info: function (message, title) {
        return swal({type: 'info', title: title, html: message, showConfirmButton: true, showCloseButton: true});
    },
    error: function (message) {
        return swal({type: 'error', html: message});
    },
    loading: function (message, disableClose) {
        disableClose = disableClose === undefined ? true : disableClose;
        var s = swal({type: 'info', html: message, allowOutsideClick: !disableClose});
        swal.showLoading();
        return s;
    },
    confirm: function (message, confirmText, cancelText, resolveOnly) {
        return new Promise(function (resolve, reject) {
            swal({
                type: 'question',
                html: message,
                showConfirmButton: true, showCancelButton: true, reverseButtons: true,
                confirmButtonText: confirmText ? confirmText : 'Procedi',
                cancelButtonText: cancelText ? cancelText : 'Annulla'
            })
                .then(function (r) {
                    if (r.value) {
                        resolve(true);
                    } else if (r.dismiss === Swal.DismissReason.backdrop || r.dismiss === Swal.DismissReason.close || r.dismiss === Swal.DismissReason.esc) {
                        reject(r.dismiss);
                    } else {
                        resolveOnly ? resolve(false) : reject(false);
                    }
                })
                .catch(_ => reject(false));
        });
    },
    input: function (message, input, confirmText, cancelText, title, defaultValue) {
        return new Promise(function (resolve, reject) {
            swal({
                title: title || '',
                type: 'question',
                input: input === 'date' ? 'text' : input,
                inputValue: defaultValue || '',
                text: message,
                showConfirmButton: true, showCancelButton: true, reverseButtons: true,
                confirmButtonText: confirmText ? confirmText : 'Procedi',
                cancelButtonText: cancelText ? cancelText : 'Annulla',
                onOpen: function (wrapper) {
                    if (input != 'date') return;
                    const content = wrapper.querySelector('.swal2-content');
                    const control = content.querySelector('input');
                    control.setAttribute('type', 'date');
                }
            })
                .then(function (r) {
                    if (r.value) {
                        resolve(r.value);
                    }
                    reject(r);
                })
                .catch(reject);
        });
    },
    exactInput: function (message, input, wantedValue, mismatchErrorMessage, confirmText, cancelText, title) {
        return new Promise(function (resolve, reject) {
            swal({
                title: title || '',
                type: 'question',
                input: input === 'date' ? 'text' : input,
                inputValue: '',
                text: message,
                showConfirmButton: true, showCancelButton: true, reverseButtons: true,
                confirmButtonText: confirmText ? confirmText : 'Procedi',
                cancelButtonText: cancelText ? cancelText : 'Annulla',
                onOpen: function (wrapper) {
                    if (input != 'date') return;
                    const content = wrapper.querySelector('.swal2-content');
                    const control = content.querySelector('input');
                    control.setAttribute('type', 'date');
                },
                preConfirm: function (inputValue) {
                    if (inputValue.trim() === wantedValue.trim()) {
                        return true;
                    }
                    Swal.showValidationMessage(
                        mismatchErrorMessage || 'I due valori non corrispondono'
                    )
                    return false;
                }
            })
                .then(function (r) {
                    if (r.value) {
                        resolve();
                    }
                    reject();
                })
                .catch(reject);
        });
    },
    select: function (message, options, confirmText, cancelText, title, defaultValue) {
        return new Promise(function (resolve, reject) {
            swal({
                title: title || '',
                type: 'question',
                input: 'select',
                inputOptions: options,
                inputValue: defaultValue || '',
                html: message,
                showConfirmButton: true, showCancelButton: true, reverseButtons: true,
                confirmButtonText: confirmText ? confirmText : 'Procedi',
                cancelButtonText: cancelText ? cancelText : 'Annulla'
            })
                .then(function (r) {
                    if (r.value) {
                        resolve(r.value);
                    }
                    reject(r);
                })
                .catch(reject);
        });
    },
    selectpicker: function (message, options, confirmText, cancelText, title, multiple, defaultValue, optionsAttributes) {
        return new Promise(function (resolve, reject) {
            swal({
                title: title || '',
                type: 'question',
                input: 'select',
                inputOptions: options,
                inputValue: defaultValue || '',
                text: message,
                showConfirmButton: true, showCancelButton: true, reverseButtons: true,
                confirmButtonText: confirmText ? confirmText : 'Procedi',
                cancelButtonText: cancelText ? cancelText : 'Annulla',
                onOpen: function (wrapper) {
                    const content = wrapper.querySelector('.swal2-content');
                    content.style.zIndex = 2;
                    content.classList.add('text-center');
                    const select = content.querySelector('select');
                    select.setAttribute('data-style', 'form-control');
                    select.setAttribute('data-size', '5.5');
                    if (multiple) {
                        select.value = null;
                        select.multiple = true;
                    }

                    /**
                     * In caso di optgroups devo cambiare il contenuto della selectbox. Le opzioni con optgroup devono
                     * avere il formato
                     * [
                     *      {
                     *          label:"Optgroup label",
                     *          options:{
                     *              [option_value1]:"option_label1",
                     *              ...
                     *              [option_valueN]:"option_labelN"
                     *          }
                     *      },
                     *      ...
                     * ]
                     * */
                    if (Array.isArray(options) && options[0].label && options[0].options) {
                        select.innerHTML = '';
                        options.map(group => {
                            const optgroup = document.createElement('optgroup');
                            optgroup.setAttribute('label', group.label);
                            Object.keys(group.options).map(value => {
                                const option = document.createElement('option');
                                option.setAttribute('value', value);
                                option.innerHTML = group.options[value];
                                optgroup.appendChild(option);
                            })
                            select.appendChild(optgroup);
                        });
                    }

                    /**
                     * Nel caso in cui ci siano attributi da aggiungere alle options leggo l'oggetto e aggiungo gli
                     * attributes.
                     * optionsAttributes = {
                     *     "{optionValue}": {
                     *         "attr1": "value1",
                     *         "attr2": "value2",
                     *     }
                     * }
                     * */
                    console.log(optionsAttributes)
                    if (optionsAttributes){
                        Object.keys(optionsAttributes).map(optionValue => {
                            const o = select.querySelector(`option[value="${optionValue}"]`);
                            if(!o) return;
                            Object.keys(optionsAttributes[optionValue]).map(attrName => {
                                o.setAttribute(attrName, optionsAttributes[optionValue][attrName]);
                            })
                        });
                    }

                    $(select).selectpicker();
                    const confirmBtn = wrapper.querySelector('.swal2-confirm');
                    confirmBtn.addEventListener('click', function (e) {
                        e.stopPropagation();
                        e.stopImmediatePropagation();
                        e.preventDefault();
                        resolve($(select).val());
                        swal.close();
                    });
                }
            });
        });
    }
};

/** @deprecated wrong name with a typo */
const FuxSwalUtiltiy = FuxSwalUtility;
