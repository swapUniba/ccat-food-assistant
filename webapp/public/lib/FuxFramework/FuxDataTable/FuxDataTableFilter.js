/**
 * @param {Object} settings Settings of the filter
 * @param {string} settings.type Can be one value of the FuxDataTableFilter.types object
 * @param {string} settings.options An object where each key represent a value of an <option> tag and the value
 * represent its text node child. (only if type is 'select' or  'datalist')
 * @param {string} settings.defaultValue
 * @param {string} settings.placeholder
 * @param {string} settings.classNames
 * @param {string} settings.filterCondition Can be one value of the FuxDataTableFilter.conditions object
 * @param {string} settings.fieldAlias If not undefined, the value of this property will be the field name sent to the
 * server in order to filters rows, replacing the default name
 * */
function FuxDataTableFilter(settings) {

    if (settings.type && Object.values(FuxDataTableFilter.types).indexOf(settings.type) == -1) throw new Error(`The specified filter type "${settings.filterCondition}" is not a valid filter type`);
    if (settings.filterCondition && Object.values(FuxDataTableFilter.conditions).indexOf(settings.filterCondition) == -1) throw new Error(`The specified filter condition "${settings.filterCondition}" is not a valid condition type`);

    return {
        data: {...settings},
        getElement: function (name, onChange) {
            const filterContainer = document.createElement('div');
            let filterControl;
            let datalistId;

            const handleChange = e => {
                const fireImmediately = event.type === 'change' && !!FuxDataTableFilter.typesFetchImmediatelyOnChange[settings.type];
                onChange(e.target.name, e.target.value, settings.filterCondition || FuxDataTableFilter.conditions.DEFAULT, fireImmediately);
            }

            switch (settings.type) {
                case 'text':
                case 'number':
                case 'date':
                    filterControl = document.createElement('input');
                    filterControl.type = settings.type;
                    break;
                case 'date_range':
                    moment.locale('it');
                    filterControl = document.createElement('input');
                    filterControl.type = 'text';
                    FuxDataTableFilter.core.loadDateRangePickerJS(function () {
                        $(filterControl).daterangepicker({
                            autoUpdateInput: false
                        }, function (start, end, label) {
                            if (start && end) {
                                filterControl.value = `${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`
                                onChange(name, {
                                    start: start.format('YYYY-MM-DD'),
                                    end: end.format('YYYY-MM-DD')
                                }, settings.filterCondition || FuxDataTableFilter.conditions.DEFAULT, true)
                            }
                        });
                        $(filterControl).on('cancel.daterangepicker', function(ev, picker) {
                            filterControl.value = '';
                            onChange(name, '', settings.filterCondition || FuxDataTableFilter.conditions.DEFAULT, true)
                        });
                        filterControl.value = '';
                    });
                    break;
                case 'datetime_range':
                    moment.locale('it');
                    filterControl = document.createElement('input');
                    filterControl.type = 'text';
                    FuxDataTableFilter.core.loadDateRangePickerJS(function () {
                        $(filterControl).daterangepicker({
                            autoUpdateInput: false
                        }, function (start, end, label) {
                            if (start && end) {
                                filterControl.value = `${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`
                                onChange(name, {
                                    start: start.format('YYYY-MM-DD') + ' 00:00:00',
                                    end: end.format('YYYY-MM-DD') + ' 23:59:59'
                                }, settings.filterCondition || FuxDataTableFilter.conditions.DEFAULT, true)
                            }
                        });

                        $(filterControl).on('cancel.daterangepicker', function(ev, picker) {
                            filterControl.value = '';
                            onChange(name, '', settings.filterCondition || FuxDataTableFilter.conditions.DEFAULT, true)
                        });

                        filterControl.value = '';
                    });
                    break;
                case 'select':
                    filterControl = document.createElement('select');
                    const placeholderOption = document.createElement('option');
                    placeholderOption.value = '';
                    placeholderOption.innerText = settings.placeholder;
                    filterControl.appendChild(placeholderOption);
                    Object.keys(settings.options).map(v => {
                        const o = document.createElement('option');
                        o.value = v;
                        o.innerText = settings.options[v];
                        filterControl.appendChild(o);
                    });
                    break;
                case 'datalist':
                    datalistId = `datalist-${(Math.random() * 100000).toFixed(0)}`;
                    const datalist = document.createElement('datalist');
                    datalist.id = datalistId;
                    Object.keys(settings.options).map(v => {
                        const o = document.createElement('option');
                        o.value = v;
                        datalist.appendChild(o);
                    });
                    filterContainer.append(datalist);
                    filterControl = document.createElement('input');
                    filterControl.type = 'text';

                default:
                    filterControl = document.createElement('input');
                    filterControl.type = 'text';
            }

            if (settings.type !== FuxDataTableFilter.types.DATE_RANGE && settings.type !== FuxDataTableFilter.types.DATETIME_RANGE) {
                filterControl.name = name;
                filterControl.onkeyup = handleChange;
                filterControl.onchange = handleChange;
            }
            filterControl.className = settings.classNames;
            filterControl.placeholder = settings.placeholder;
            filterContainer.appendChild(filterControl)
            if (datalistId) filterControl.setAttribute('list', datalistId);
            return filterContainer;
        }
    }
}

FuxDataTableFilter.types = {
    TEXT: 'text',
    NUMBER: 'number',
    SELECT: 'select',
    DATALIST: 'datalist',
    DATE: 'date',
    DATE_RANGE: 'date_range',
    DATETIME_RANGE: 'datetime_range',
}

FuxDataTableFilter.typesFetchImmediatelyOnChange = {
    [FuxDataTableFilter.types.SELECT]: true,
    [FuxDataTableFilter.types.DATALIST]: true,
    [FuxDataTableFilter.types.DATE]: true,
    [FuxDataTableFilter.types.DATE_RANGE]: true,
}

FuxDataTableFilter.core = {
    loadDateRangePickerJS_loaded: false, //If the library has been loaded
    loadDateRangePickerJS_request: false, //If the library load has started
    loadDateRangePickerJS: function (load) {
        if (FuxDataTableFilter.core.loadDateRangePickerJS_loaded) return load();

        FuxEvents.on('loadDateRangePickerJS_done', load);
        if (FuxDataTableFilter.core.loadDateRangePickerJS_request) return;
        FuxDataTableFilter.core.loadDateRangePickerJS_request = true;

        //Load CSS
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        link.href = 'https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css';
        //Load JS
        var s = document.createElement('script');
        s.setAttribute('src', "https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js");
        document.body.appendChild(s);
        s.addEventListener('load', _ => {
            FuxDataTableFilter.core.loadDateRangePickerJS_loaded = true;
            FuxEvents.emit('loadDateRangePickerJS_done')
            FuxEvents.off('loadDateRangePickerJS_done', load);
        });
    }
}

FuxDataTableFilter.conditions = {
    CONTAIN: 'contain',
    CONCAT_CONTAIN: 'concat_contain',
    CONCAT_CONTAIN_EXACT_WORD: 'concat_contain_exact_word',
    EQUAL: 'equal',
    EQUAL_DATE: 'equal_date',
    GREATER: 'greater',
    GREATER_EQ: 'greaterEq',
    LOWER: 'lower',
    LOWER_EQ: 'lowerEq',
    DEFAULT: 'contain',
    BETWEEN_EXCLUSIVE: 'between_exclusive',
    BETWEEN_INCLUSIVE: 'between_inclusive',
    BETWEEN_INCLUSIVE_RIGHT: 'between_inclusive_right',
    BETWEEN_INCLUSIVE_LEFT: 'between_inclusive_left',
    IN_SET: 'in_set',
}
