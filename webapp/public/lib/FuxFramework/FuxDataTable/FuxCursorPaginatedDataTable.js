/**
 * Create
 * @param {Object} options Options of the component
 * @param {String} options.paginationType "offset" or "cursor" (cursor is default)
 * @param {Function} options.fetchUrl
 * @param {Function} options.fetchParams
 * @param {Function} options.emptyText
 * @param {Function} options.columnNameOverride A function which returns a string (also HTML string) to use in place of
 * @param {Object} options.filters An object where each key represent a possible column name and each
 * value is a function which transform a specific value. The function has the following arguments (cellValue, rowData)
 * @param {Object} options.sortables An object where each key represent a possible column name that can be sorted and each
 * value is a FuxDataTableSortable object
 * @param {Function} options.onFiltersChange A function that will be called when a filter change.  The function receive the updated filters as argument.
 * @param {Array} options.skipColumns An array of columns names which will not be shown
 * @param {Array} options.useOnlyColumns An array of columns names that will be used, the other ones will be skipped
 * @param {Object} options.customColumns An object where each key represent a column name and it's value is a function
 * returning cell value and takes as parameter the row object
 * @param {Object} options.cellValueOverrideSettings An object where each key represent a possible column name and each
 * value is a function which return string (also with HTML) or a DOM element that will replace the orginal cell value.
 * The function has the following arguments (cellValue, rowData)
 * @param {Element} options.container A DOM element to use as container of the table
 * @param {Element} options.controlsContainer A DOM element to use as container of pagination controls
 * @param {String} options.tableWrapperClass
 * @param {String} options.tableHeadClass Default "bg-primary text-white"
 * @param {Boolean} options.checkboxes Whether to show or not selection checkboxes
 * @param {String | String[]} options.uniqueColumns Tuple of column names or single column name that can uniquely represent a row
 * @param {Function} options.selectedLabelTemplate A function that accept as parameter the number of selected rows and return the string to show
 * @param {Function} options.onRowRender A function that accept two params row like DOM element and row data
 * @param {Object} options.selectedActions An object of functions that accept the list of selected items as parameter.
 * Each "key" represent an option in the actions dropdown
 * @param {Function} options.onPageRendered
 * @param {Number} options.maxVisiblePages Default 5
 *
 * */
function FuxCursorPaginatedDataTable(options) {


    if (options.checkboxes && !options.uniqueColumns) {
        throw new Error("In order to enable checkboxes you have to set the 'uniqueColumns' option")
    }

    let selectedRows = [];
    const uniqueColumns = Array.isArray(options.uniqueColumns) ? [...options.uniqueColumns] : [options.uniqueColumns];
    const getUID = r => uniqueColumns.map(f => r[f]).join('-');
    const canRenderCol = colName => {
        if (options.customColumns && options.customColumns[colName] !== undefined) return true;
        if (options.useOnlyColumns && !options.useOnlyColumns.find(c => c === colName)) return false;
        if (options.skipColumns && options.skipColumns.find(c => c === colName)) return false;
        return true;
    }

    const tableWrapper = document.createElement('div');
    if (options.tableWrapperClass) tableWrapper.className = options.tableWrapperClass;

    const table = document.createElement('table');
    table.className = "table w-100";

    /** @MARK Selection controls */
    const selectionControlsContainer = document.createElement('div');
    selectionControlsContainer.className = "d-flex align-items-center mb-3"
    if (options.checkboxes) options.container.appendChild(selectionControlsContainer);

    function handleSelectionChange() {
        selectionControlsContainer.innerHTML = '';
        if (!selectedRows.length) return;

        selectionControlsContainer.innerHTML += options.selectedLabelTemplate ? options.selectedLabelTemplate(selectedRows.length) : `${selectedRows.length} element(s) selected`;

        if (options.selectedActions) {
            const dropdown = document.createElement('div');
            dropdown.className = "dropdown ml-2";
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary dropdown-toggle';
            btn.innerHTML = 'Con selezionati'
            btn.setAttribute('data-toggle', 'dropdown');
            const dropdownMenu = document.createElement('div');
            dropdownMenu.className = "dropdown-menu";

            Object.keys(options.selectedActions).map(k => {
                const optionBtn = document.createElement('btn');
                optionBtn.className = "dropdown-item cursor-pointer";
                optionBtn.innerHTML = k;
                optionBtn.addEventListener('click', _ => {
                    options.selectedActions[k](selectedRows);
                });
                dropdownMenu.appendChild(optionBtn);
            });

            dropdown.appendChild(btn);
            dropdown.appendChild(dropdownMenu);
            selectionControlsContainer.appendChild(dropdown);
        }
    }

    /** @MARK Header */
    const tableHeader = document.createElement('thead');
    tableHeader.className = options.tableHeadClass || "bg-primary text-white";
    table.appendChild(tableHeader);

    let __last_header_cols = [];

    function updateTableHeader(cols) {
        if (JSON.stringify(cols) == __last_header_cols) return;
        const row = document.createElement('tr');
        if (options.checkboxes) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', e => {
                Array.from(tableBody.querySelectorAll('[name="check_row"]')).map(c => {
                    c.checked = e.target.checked;
                    c.dispatchEvent(new Event('change'));
                });
            })
            let th = document.createElement('th');
            th.appendChild(checkbox);
            row.appendChild(th);
        }
        cols.map(colName => {
            if (canRenderCol(colName)) {
                let th = document.createElement('th');
                const colText = options.columnNameOverride ? options.columnNameOverride(colName) : colName;
                if (options.sortables && options.sortables[colName]) {
                    th.appendChild(options.sortables[colName].getElement(colName, colText, handleSortChange));
                    th.style.whiteSpace = 'nowrap';
                } else {
                    th.innerHTML += `<b>${colText}</b>`;
                }

                row.appendChild(th);
            }
        });
        tableHeader.innerHTML = '';
        tableHeader.appendChild(row);
        __last_header_cols = JSON.stringify(cols);
    }

    /** @MARK Filters */
    let filtersValue = {};
    const filtersRow = document.createElement('tr');
    filtersRow.className = "bg-light text-white d-none";
    table.appendChild(filtersRow);

    let __filter_rendered = false;

    function renderFiltersRow(cols) {
        if (!options.filters || __filter_rendered) return;
        __filter_rendered = true;
        filtersRow.classList.remove('d-none');
        if (options.checkboxes) {
            filtersRow.innerHTML += `<td></td>`;
        }
        cols.map(field => {
            if (!canRenderCol(field)) return;
            const filter = options.filters[field] || null;
            const filterCol = document.createElement('td');
            if (filter) {
                filterCol.appendChild(filter ? filter.getElement(filter.data.fieldAlias || field, handleFilterChange) : document.createElement('div'));
            } else {
                const emptyEl = document.createElement('div');
                emptyEl.innerHTML = '&nbsp;'
                filterCol.appendChild(emptyEl);
            }

            filtersRow.appendChild(filterCol);
        });
    }

    let __filter_change_timeout = null;

    function handleFilterChange(name, value, filterCondition, fetchImmediately) {
        if (filtersValue[name] && filtersValue[name].value == value) return;
        if (__filter_change_timeout) clearTimeout(__filter_change_timeout);
        filtersValue[name] = {value: value, condition: filterCondition};
        if (value === '' && filtersValue[name] != undefined) delete filtersValue[name];
        __filter_change_timeout = setTimeout(_ => {
            paginator.reset();
            if (options.onFiltersChange) {
                const filters = {};
                Object.keys(filtersValue).map(f => {
                    if (filtersValue[f]) {
                        filters[f] = filtersValue[f];
                    }
                });
                options.onFiltersChange(filters);
            }
        }, fetchImmediately ? 1 : 300);
    }

    function handleSortChange(field) {
        if (options.sortables) {
            for (let k in options.sortables)
                if (k != field) options.sortables[k].setSortType(FuxDataTableSortable.sortTypes.NONE);
        }
        paginator.reset(); //Resetting the paginator the new sorted columns will be used
    }

    //Returns the encoded filter to use in the page fetch request
    function __getFetchFiltersEncoded() {
        const filters = {};
        Object.keys(filtersValue).map(f => {
            if (filtersValue[f]) {
                filters[f] = filtersValue[f];
            }
        });
        if (Object.keys(filters).length) return btoa(JSON.stringify(filters));
        return '';
    }

    //Returns the list of sorted fields to use in the page fetch request
    function __getSortFields() {
        return Object.keys(options.sortables || {}).reduce((acc, f) => {
            const sortableData = options.sortables[f].getData();
            if (sortableData.sortType != FuxDataTableSortable.sortTypes.NONE) {
                const sortType = FuxDataTableSortable.sortTypes[sortableData.sortType];
                if (sortType) acc[sortableData.fieldAlias || f] = sortType;
            }
            return acc;
        }, {});
    }

    function getFetchingParams() {
        const isFunction = f => f && {}.toString.call(f) === '[object Function]';

        return new Promise(resolve => {
            const doResolve = customFetchParams => {
                const params = {...(customFetchParams || {})};
                //Aggiungo i filtri ai parametri
                params.filters = __getFetchFiltersEncoded();

                const sortFields = __getSortFields();
                if (sortFields) params.sortFields = sortFields;

                resolve(params);
            }

            if (isFunction(options.fetchParams)) {
                options.fetchParams().then(customFetchParams => {
                    doResolve(customFetchParams);
                })
            } else {
                doResolve(options.fetchParams);
            }
        });
    }

    /** @MARK Body */
    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);


    /** @MARK Controls */
    const controlsContainer = options.controlsContainer || document.createElement('div');


    options.container.appendChild(table);

    tableWrapper.appendChild(table);
    options.container.appendChild(tableWrapper);
    if (!options.controlsContainer) options.container.appendChild(controlsContainer);

    /** @MARK Utility/Mixed */
    function isElement(o) {
        return (
            typeof HTMLElement === "object" ? o instanceof HTMLElement : //DOM2
                o && typeof o === "object" && o !== null && o.nodeType === 1 && typeof o.nodeName === "string"
        );
    }


    function handleRowCheckboxChange(e) {
        const uid = e.target.value;
        if (e.target.checked) {
            const newRow = paginator.getItems().find(r => getUID(r) === uid);
            if (newRow && !selectedRows.find(r => getUID(r) === uid)) selectedRows.push(newRow);
        } else {
            selectedRows = selectedRows.filter(r => getUID(r) !== uid);
        }
        handleSelectionChange();
    }


    const PaginatorClass = options.paginationType === 'offset' ? FuxOffsetPaginator : FuxCursorPaginator;

    const paginator = PaginatorClass({
        container: tableBody,
        controlsContainer: controlsContainer,
        maxVisiblePages: options.maxVisiblePages || 5,
        sortableColumns: [],
        onItemRender: function (row) {
            const rowEl = document.createElement('tr');
            rowEl.className = "bg-white";
            const cols = [...Object.keys(row), ...Object.keys(options.customColumns || {})];
            if (options.checkboxes) {
                rowEl.innerHTML += `<td><input type="checkbox" name="check_row" value="${getUID(row)}"/></td>`
                rowEl.querySelector('[name="check_row"]').addEventListener('change', handleRowCheckboxChange);
            }
            updateTableHeader(cols);
            renderFiltersRow(cols);
            cols.map(k => {
                if (canRenderCol(k)) {
                    const shouldOverride = options.cellValueOverrideSettings && options.cellValueOverrideSettings[k];
                    const isCustomColumn = options.customColumns && options.customColumns[k];
                    const v = shouldOverride ?
                        options.cellValueOverrideSettings[k](row[k], row) :
                        (
                            isCustomColumn ?
                                options.customColumns[k](row) :
                                row[k]
                        );
                    const td = document.createElement('td');
                    if (v instanceof Element || v instanceof HTMLDocument) {
                        td.appendChild(v);
                    } else {
                        td.innerHTML += v;
                    }
                    rowEl.appendChild(td);
                }
                if (options.onRowRender) {
                    options.onRowRender(rowEl, row)
                }
            });
            return rowEl;
        },
        onPageRendered: options.onPageRendered,
        onItemSkeletonRender: FuxCursorPaginator.utility.tableRowSkeletonRender(null, 58),
        onPageRequest: function (cursor) {
            return new Promise((resolve, reject) => {

                const isFunction = f => f && {}.toString.call(f) === '[object Function]';

                const doFetch = (customFetchParams) => {
                    const params = {...(customFetchParams || {}), cursor: cursor, page: cursor || 1};
                    //Aggiungo i filtri ai parametri
                    const filters = __getFetchFiltersEncoded();
                    if (filters) params.filters = filters;
                    const sortFields = __getSortFields();
                    console.log(sortFields)
                    if (sortFields) params.sortFields = sortFields;

                    FuxHTTP.get(options.fetchUrl, params, FuxHTTP.RESOLVE_DATA, FuxHTTP.REJECT_MESSAGE)
                        .then(paginationPage => resolve(paginationPage))
                        .catch(FuxSwalUtiltiy.error);
                }

                if (isFunction(options.fetchParams)) {
                    options.fetchParams().then(doFetch)
                } else {
                    doFetch(options.fetchParams);
                }

            });
        },
        onEmptyPage: function () {
            const el = document.createElement('div');
            el.innerHTML = options.emptyText || `
                    <h3 class="text-center">Non c'è nulla da visualizzare qui</h3>
                `;
            return el;
        }
    });

    return {
        paginator: paginator,
        getSelectedRows: _ => selectedRows,
        getEncodedFilters: _ => __getFetchFiltersEncoded(),
        getSortFields: _ => __getSortFields(),
        getFetchingParams: getFetchingParams,
    };
}

FuxCursorPaginatedDataTable.utility = {
    lodashColumnNameOverride: col => col.toLowerCase().replace(/_/g, " ").replace(/\b[a-z]/g, l => l.toUpperCase()),
    /**
     * Create a button group
     *
     * @typedef {Object} Button
     * @property {String} label
     * @property {String} class
     * @property {Function} click
     * @property {String} href
     *
     * @param {Button[]} buttons
     * */
    createButtonList: (buttons) => {
        const listContainer = document.createElement('div');
        buttons.map(b => {
            const btn = b.click ? document.createElement('button') : document.createElement('a');
            if (b.label) btn.innerHTML = b.label;
            if (b.class) btn.className = b.class;
            if (b.click) btn.addEventListener('click', b.click);
            if (b.href) btn.href = b.href;
            listContainer.appendChild(btn);
        });
        return listContainer;
    },
    /**
     * Create a button group
     *
     * @typedef {Object} DropdownItem
     * @property {String} tag
     * @property {String} label
     * @property {String} class
     * @property {Function} click
     * @property {String} href
     * @property {String} target
     *
     * @param {String} togglerHtml
     * @param {DropdownItem[]} items
     * @param {Number} direction 1 = up , 0 = down
     * */
    dropdownMenu: (togglerHtml, items, direction) => {
        const dropdown = document.createElement('div');
        dropdown.className = `dropdown ${direction ? 'dropup' : ''}`;
        const dropdownToggle = document.createElement('button');
        dropdownToggle.className = 'btn btn-link text-muted';
        dropdownToggle.innerHTML = togglerHtml;
        dropdownToggle.setAttribute('data-toggle', 'dropdown');
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        for (let item of items) {
            const itemEl = document.createElement(item.tag);
            itemEl.className = 'dropdown-item cursor-pointer';
            if (item.href) itemEl.href = item.href;
            if (item.target) itemEl.target = item.target;
            if (item.click) itemEl.addEventListener('click', item.click);
            itemEl.innerHTML = item.label;
            dropdownMenu.appendChild(itemEl);
        }
        dropdown.appendChild(dropdownToggle);
        dropdown.appendChild(dropdownMenu);
        $(document).ready(_ => $(dropdownToggle).dropdown());
        return dropdown;
    }
};


(function () {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    head.appendChild(style);
    //language=CSS
    style.appendChild(document.createTextNode(`
        @keyframes shineAnimation {
            0% {
                transform: translate3d(-100%, 0, 0);
            }
            100% {
                transform: translate3d(100%, 0, 0);
            }
        }

        .skeleton-placeholder {
            background: #dedede;
            overflow: hidden;
            position: relative;
        }

        .skeleton-placeholder::after {
            display: block;
            content: '';
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #dedede, #fcfcfc, #dedede);
            animation: shineAnimation 1s ease-in-out infinite;
        }
    `));
})();

