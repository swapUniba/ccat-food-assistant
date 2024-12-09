const FuxUIUtility = {
    /**
     * Possibilità di legare (bind) la visibilità di un elemento ad una valore associato ad un altro elemento.
     * NB: Al momento è supportato ogni input/select su cui è applicabile l'evento "change"
     *
     * @syntax
     * Inserire come attributi dell'elemento da mostrare o nascondere i seguenti attributi
     * fux-bind-display-to="{selector}" => dove {selector} è un selettore DOM valido
     * fux-bind-value="{value}" => dove {value} è il valore recuperabile tramite {selector} che permette all'elemento su cui sono applicati gli attributi di essere visibile
     *
     * @NB: Se l'elemento da nascondere è una option, allora il suo parent select verrà disabilitato della sua opzione selezionata
     * */
    bindVisibility: (new BindVisibilityHelper()),
    bindAttribute: (new BindAttributeHelper()),
    /**
     * @param {String} tag
     * @param {Object} props
     * @param {Object} attrs
     * @param {Array} ch
     *
     * @return {HTMLElement}
     * */
    createElement: (tag, props = {}, attrs = {}, ch = []) => ch.reduce((e, c) => (e.appendChild(c), e), Object.entries(attrs).reduce((e, [k, v]) => (e.setAttribute(k, v), e), Object.assign(document.createElement(tag), props)))
};


function BindVisibilityHelper() {
    let displayBinderMap = {}; //Mappatura dei binding per mostrare/nascondere in base ad un value di un input/select
    let contentBinderMap = {}; //Mappatura dei binding per mostrare il valore di un input/select come contenuto di un DOM element

    function createBindEvents(context, skipInitialTrigger) {
        displayBinderMap = {};
        contentBinderMap = {};
        $(context).find("[fux-bind-display-to]").each(function () {
            const selector = $(this).attr('fux-bind-display-to');
            if (!displayBinderMap[selector]) {
                displayBinderMap[selector] = [];
            }
            const valueSparator = $(this).attr('fux-bind-value-separator');
            const hasMultipleValue = !!valueSparator;
            displayBinderMap[selector].push({
                element: $(this).get(0),
                value: hasMultipleValue ? $(this).attr('fux-bind-value').split(valueSparator) : $(this).attr('fux-bind-value'),
                hasMultipleValues: hasMultipleValue,
            });
        });

        for (const selector in displayBinderMap) {
            if (displayBinderMap.hasOwnProperty(selector)) {
                $(context).find(selector).on('change', function () {
                    const element = $(this).get(0);
                    if (element.getAttribute('type') === 'radio') {
                        if (!element.checked) return;
                    }
                    for (var i = 0; i < displayBinderMap[selector].length; i++) {
                        var checkData = displayBinderMap[selector][i];
                        if (checkData.hasMultipleValues) {
                            if (checkData.value.indexOf(element.value) > -1) {
                                checkData.element.style.display = null;
                            } else {
                                checkData.element.style.display = "none";
                            }
                        } else {
                            let valueToCompare = element.value;
                            if (element.tagName === 'INPUT' && element.getAttribute('type') === 'checkbox') {
                                valueToCompare = $(this).get(0).checked ? "1" : "0";
                            }

                            if (checkData.value == valueToCompare) {
                                checkData.element.style.display = null;
                            } else {
                                checkData.element.style.display = "none";
                            }

                        }

                        //Se si tratta di un tag option a cui è stata tolta la visibilità, resetto il valore della select al
                        //primo option visibile o alla option precedentemente selezionata (se ancora visibile)
                        //Per farlo itero tutte le option visibili. Se incontro quella attualmente scelta allora uso quella.
                        //Altrimenti prendo la prima visibile.
                        if (checkData.element.tagName === 'OPTION') {
                            const select = checkData.element.parentNode;
                            const selectCurrValue = select.value;
                            var candidateNewValue = null;
                            for (var j = 0; j < select.options.length; j++) {
                                if (select.options[j].style.display !== 'none') {
                                    if (select.options[j].value === selectCurrValue) {
                                        candidateNewValue = selectCurrValue;
                                        break;
                                    } else {
                                        candidateNewValue = candidateNewValue ? candidateNewValue : select.options[j].value; //Se ho già un candidate value non lo sostituisco
                                    }
                                }
                            }
                            select.value = candidateNewValue;
                        }
                    }
                });
                if (!skipInitialTrigger) {
                    $(context).find(selector).trigger('change');
                }
            }
        }


        $(context).find('[fux-bind-content-to]').each(function () {
            const selector = $(this).attr('fux-bind-content-to');
            if (!contentBinderMap[selector]) {
                contentBinderMap[selector] = [];
            }
            contentBinderMap[selector].push({
                element: $(this).get(0)
            })
        });

        for (const selector in contentBinderMap) {
            if (contentBinderMap.hasOwnProperty(selector)) {
                $(context).find(selector).on('change', function () {
                    const target = $(this).get(0);
                    contentBinderMap[selector].map(bindData => {
                        bindData.element.innerHTML = target.value;
                    });
                });
            }
            if (!skipInitialTrigger) {
                $(context).find(selector).trigger('change');
            }
        }
    }

    return {
        registerDOMTree: function (context, skipInitialTrigger) {
            createBindEvents(context, skipInitialTrigger);
        },
        getMap: _ => displayBinderMap
    }
}


//Permette di settare il valore di un attributo di un elemento del DOM in base ad un value di un input/select
function BindAttributeHelper() {

    let attributeBinderMap = {};

    function createBindEvents(context, skipInitialTrigger) {
        //Recupero tutti gli elementi che devono aggiornare un attribute tramite il valore di input recuperato attraverso
        // una stringa selector
        const elements = Array.from(context.querySelectorAll('[fux-bind-attribute]'));
        elements.map(element => {
            const attribute = element.getAttribute('fux-bind-attribute');
            const selector = element.getAttribute('fux-bind-selector');
            if (!attributeBinderMap[selector]) attributeBinderMap[selector] = [];
            attributeBinderMap[selector].push({
                element: element,
                attribute: attribute
            });
        });

        //Creo gli eventi per ogni selettore
        Object.keys(attributeBinderMap).map(selector => {
            const el = context.querySelector(selector);
            const itemsToUpdate = attributeBinderMap[selector];

            const handleChange = e => {
                if (e.target.type !== 'checkbox' || e.target.checked){
                    itemsToUpdate.map(data => {
                        data.element.setAttribute(data.attribute, e.target.value);
                    })
                }else {
                    itemsToUpdate.map(data => {
                        data.element.removeAttribute(data.attribute);
                    })
                }
            }

            el.addEventListener('change', handleChange)
            el.addEventListener('keyup', handleChange)

            if (!skipInitialTrigger) {
                el.dispatchEvent(new Event('change'));
            }
        })
    }

    return {
        registerDOMTree: function (context, skipInitialTrigger) {
            createBindEvents(context, skipInitialTrigger);
        },
        getMap: _ => attributeBinderMap
    }
}
