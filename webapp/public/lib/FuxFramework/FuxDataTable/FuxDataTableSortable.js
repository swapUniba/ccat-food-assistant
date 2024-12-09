/**
 * @param {Object} settings Settings of the filter
 * @param {String} settings.initialSortType Can be null | "DESC" or "ASC"
 * @param {string} settings.fieldAlias If not undefined, the value of this property will be the field name sent to the
 * server in order to sort rows, replacing the default name
 * */
function FuxDataTableSortable(settings) {
    if (!settings.initialSortType) settings.initialSortType = FuxDataTableSortable.sortTypes.NONE;
    if (!FuxDataTableSortable.sortTypes.hasOwnProperty(settings.initialSortType)) throw new Error(`The specified filter sort type "${settings.initialSortType}" is not a valid sort type`);

    const state = {
        fieldAlias: settings.fieldAlias,
        sortType: settings.initialSortType,
        text: ''
    };

    const sortContainer = document.createElement('div');
    sortContainer.className = 'cursor';
    sortContainer.style.cursor = 'pointer';

    const render = _ => {
        sortContainer.innerHTML = '';
        switch (state.sortType) {
            case FuxDataTableSortable.sortTypes.ASC:
                sortContainer.innerHTML = `${state.text}&nbsp; <i class="fas fa-sort-up"></i>`;
                break;
            case FuxDataTableSortable.sortTypes.DESC:
                sortContainer.innerHTML = `${state.text}&nbsp; <i class="fas fa-sort-down"></i>`;
                break;
            default:
                sortContainer.innerHTML = `${state.text}&nbsp; <i class="fas fa-sort"></i>`;
                break;
        }
    }

    const handleChange = e => {
        const SORT_CHANGE_CYCLE = ['ASC', 'DESC', 'NONE'];
        state.sortType = SORT_CHANGE_CYCLE[(SORT_CHANGE_CYCLE.indexOf(state.sortType) + 1) % SORT_CHANGE_CYCLE.length];
        render();
        if (state.onChange) state.onChange(state.name, state.sortType);
    }

    sortContainer.addEventListener('click', handleChange);

    return {
        getData: _ => ({...state}),
        setSortType: t => {
            state.sortType = t;
            render();
        },
        getElement: function (name, text, onChange) {
            state.text = text;
            state.name = name;
            state.onChange = onChange;
            render();
            return sortContainer;
        }
    }
}

FuxDataTableSortable.sortTypes = {
    DESC: 'DESC',
    ASC: 'ASC',
    NONE: 'NONE'
}
