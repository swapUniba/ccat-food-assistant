/**
 * AsyncCrud.js v1.01
 * @description Utilizzata per gestire l'invio al controller dei campi di un form
 * ogni form deve contenere al suo interno tutti i campi che sono richiesti dal controller.
 * Changelog History:
 * @v1.00: Prima release
 * @v1.01: Nella function "setFormElementData" se nell'object restituito in GET dal controller sono presenti oggetti annidati
 * è possibile utilizzare quegli oggetti per popolare input nel form che hanno nomi in array style.
 * Se la chiave di questi oggetti annidati è di tipo testuale allora viene ricercato il campo con
 * [name = "*nome_chiave_root*[*nome_chiave_annidata*]"]
 * altrimenti se la chiave annidata è un valore intero (e quindi l'object annidato è un array e non un dizionario)
 * viene ricercato il campo con
 * [name = "*nome_chiave_root*[]"][value = "*valore_annidato*"]
 * @v1.02: Aggiunto parametro onEditOpen
 * @v1.03: Aggiunto supporto a select input con attributo multiple. In predefinedData deve essere passato un vettore di value.
 * */

/**
 * @param options = {
 *     controllerUrl: String
 *     baseForm: DomElement,
 *     onSaveSuccess,
 *     onSaveError,
 *     onEditSuccess,
 *     onEditError,
 *     getModelRequestBody: Object | Callable,
 *     pkName: String,
 *     onBeforeSubmit: Callable,
 *     predefinedData: Object,
 *     onEditOpen: Callable
 * }
 * */

function AsyncCrud(options) {
    var controllerUrl = options.controllerUrl ? options.controllerUrl : _CONTROLLER_URL;
    console.log(controllerUrl);
    console.log(options);

    function constructor() {
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': FuxHTTP.getCookie('XSRF-TOKEN')
            }
        });
        registerFormSubmit(options.baseForm, options.onSaveSuccess, options.onSaveError);
        if (options.predefinedData) {
            setFormElementData(options.baseForm, options.predefinedData);
            if (options.onPredefinedDataSet) {
                options.onPredefinedDataSet();
            }
        }

    }

    function edit(id) {
        getModel(id)
            .then(function (data) {
                var formClone = $("<div>").append($(options.baseForm).clone(true));
                swal({
                    html: formClone.html(),
                    showConfirmButton: false,
                    onOpen: function () {
                        var $form = $(swal.getContent()).find("form");
                        setFormElementData($form.get(0), data);
                        if (options.onEditOpen) {
                            options.onEditOpen($form.get(0));
                        }
                        $form.append("<input type='hidden' name='" + options.pkName + "' value='" + data[options.pkName] + "'/>");
                        $form.find("button[type='submit']").text("Salva modifiche");
                        registerFormSubmit($form, options.onEditSuccess, options.onEditError);
                    },
                    width: "80%"
                });
            })
            .catch(function (response) {
                swal({type: "error", text: response.message});
            });
    }

    function getModel(id) {
        var data = isFunction(options.getModelRequestBody) ? options.getModelRequestBody(id) : options.getModelRequestBody;
        return new Promise(function (resolve, reject) {
            $.get(controllerUrl, data, function (jsonResponse) {
                if (jsonResponse.status === 'OK') {
                    resolve(jsonResponse.data);
                } else {
                    reject(jsonResponse);
                }
            })
                .fail(_defaultOnFail);
        });
    }

    function _defaultOnFail() {
        swal({type: "error", text: "Qualcosa è andato storto, controlla la tua connessione a internet e riprova."})
    }

    function submitData(formData) {
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: controllerUrl,
                type: $(options.form).attr("method") ? $(options.form).attr("method") : "POST",
                data: formData,
                async: true,
                cache: false,
                contentType: false,
                processData: false
            })
                .done(function (jsonResponse) {
                    if (jsonResponse.status == "OK") {
                        resolve(jsonResponse);
                    } else if (jsonResponse.status == "ERROR") {
                        reject(jsonResponse);
                    } else {
                        resolve(jsonResponse);
                    }
                })
                .fail(function (error) {
                    _defaultOnFail(error);
                });
        });
    }

    function registerFormSubmit(form, onSuccess, onError) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            //on-before-submit
            var onBefore = form.getAttribute("data-before-submit");
            if (onBefore) {
                if (!eval(onBefore)) {
                    return;
                }
            }

            var startFormData = new FormData(form);
            if (isFunction(options.onBeforeSubmit)) {
                var onBeforeSubmitResult = options.onBeforeSubmit(startFormData);
                if (onBeforeSubmitResult === true) {
                    __submit(new FormData(form));
                } else if (onBeforeSubmitResult instanceof Promise) {
                    onBeforeSubmitResult.then(result => {
                        if (result === true) { //Una promise che non restituisce un formdata, una AsyncFunction in realtà è gestita come una promise
                            __submit(new FormData(form));
                        } else {
                            __submit(result)
                        }
                    });
                } else if (onBeforeSubmitResult instanceof FormData) {
                    __submit(onBeforeSubmitResult);
                } else {
                    //return; is unnecessary
                }
            } else {
                __submit(new FormData(form)); //Se non c'è un onBeforeSubmit da verificare allora invio il form
            }

            function __submit(formData) {
                Array.from(form.querySelectorAll('input[type="checkbox"][data-unchecked-value]')).map(c => {
                    if (!c.checked){
                        formData.append(c.getAttribute('name'), c.getAttribute('data-unchecked-value'));
                    }
                });
                submitData(formData)
                    .then(function (response) {
                        if (isFunction(onSuccess)) {
                            onSuccess(response);
                        }
                    })
                    .catch(function (response) {
                        if (isFunction(onError)) {
                            onError(response);
                        }
                    });
            }
        })

    }

    function setFormElementData(form, data) {
        var $form = $(form);
        /**
         * Normalizzo i valori dell'object data, facendo in modo che oggetti annidati salgano nella gerarchia
         * es.
         * {attributi:{at1:1, at2:2, at3:3}}
         * diventerà
         * {"attributi[at1]":1, "attributi[at2]":2, "attributi[at3]":3, attributi:{at1:1, at2:2, at3:3}}
         */
        for (var key in data) {
            if (typeof data[key] === "object") {
                for (var nestKey in data[key]) {
                    if (isNaN(parseInt(nestKey))) {
                        data[key + "[" + nestKey + "]"] = data[key][nestKey];
                    } else {
                        data["{{IND_" + nestKey + "_VAL_" + data[key][nestKey] + "}}" + key + "[]"] = data[key][nestKey]; //Si tratta di un array e lo segno con le "{chiave}"
                    }
                }
            }
        }


        //Setto gli elementi nel form
        for (var propName in data) {
            //Verifico se la propName si riferisce ad un campo di tipo array da usare sulle checkbox
            if (propName.startsWith("{")) {
                var realInputName = propName.replace(/{{(.*)}}/, "");
                var inputValue = data[propName] || '';
                var sanitizedInputValue = inputValue && typeof inputValue == 'string' ? inputValue.replace(/\"/g, '\\"') : inputValue;
                var $el = $form.find('[name="' + realInputName + '"][value="' + sanitizedInputValue + '"]');
                if ($el.attr("type") === "checkbox") data[propName] = '1';
            } else if (Array.isArray(data[propName])) {
                var $el = $form.find('[name="' + propName + '[]"]');
            } else {
                var $el = $form.find('[name="' + propName + '"]');
            }

            if ($el.length) {
                if ($el.get(0).tagName === "SELECT") {
                    if ($el.prop('multiple')) {
                        data[propName].map((value, i) => {
                            $el.find('[value="' + value + '"]').prop("selected", true);
                        });
                    } else {
                        $el.find('[value="' + data[propName] + '"]').prop("selected", true);
                    }
                } else if ($el.get(0).tagName === "INPUT" && $el.attr('type') === 'checkbox') {
                    if (data[propName] == '1') {
                        $el.attr("checked", true);
                    } else {
                        $el.removeAttr("checked");
                    }
                } else if ($el.get(0).tagName === "INPUT" && $el.attr('type') === 'radio') {
                    //Trovo la radiobox con il valore scelto
                    $el.each(function () {
                        if ($(this).val() === data[propName]) {
                            $(this).prop('checked', true);
                        }
                    });
                } else if ($el.get(0).tagName === "INPUT" && ($el.attr('type') === 'text' || $el.attr('type') === 'email')) {
                    $el.val(data[propName]);
                } else if ($el.get(0).tagName === "TEXTAREA") {
                    $el.html(data[propName]);
                } else if ($el.get(0).tagName === "INPUT" && $el.attr('type') === 'number') {
                    //Applico una normalizzazione tramite l'attributo step
                    var val = parseFloat(data[propName]);
                    if ($el.attr("step")) {
                        val = val.toFixed((parseFloat($el.attr("step")).precision()));
                    }
                    $el.val(val);
                } else if ($el.get(0).tagName === "INPUT" && $el.attr('type') === 'file') {
                    //continue;
                } else { //HIDDEN
                    $el.val(data[propName]);
                }
            }
        }
    }

    constructor();

    return {
        edit: edit,
        registerForm: registerFormSubmit,
        getPkName: () => options.pkName | ""
    }
}

window.isFunction = function (functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
};

Number.prototype.precision = function () {
    var a = this.valueOf();
    if (!isFinite(a)) return 0;
    var e = 1, p = 0;
    while (Math.round(a * e) / e !== a) {
        e *= 10;
        p++;
    }
    return p;
};

/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
window.merge_options = function (obj1, obj2) {
    var obj3 = {};
    for (var attrname in obj1) {
        obj3[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        obj3[attrname] = obj2[attrname];
    }
    return obj3;
};
