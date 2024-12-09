/**
 * Create a customizable limit-offset pagination system
 * @param {Object} options Options of the component
 * @param {Function} options.onItemRender A function which return a DOM element to render in place of the i-th item
 * @param {Function} options.onPageRendered A function executed when all page's items have been render
 * @param {Function} options.onItemSkeletonRender A function which return a DOM element to render as placeholder item while fetching new items
 * @param {Number} options.skeletonItemsNum Number of skeletons placeholders to render
 * @param {Function} options.onPageRequest A function which return a Promise that resolve with the requested page
 * @param {Function} options.onEmptyPage A function which return a DOM element to render when no item to display
 * @param {Element} options.container A DOM element to use as container of the pagination system
 * @param {Element} options.controlsContainer A DOM element to use as container of control buttons
 * @param {String} options.itemsContainerClassName
 * @param {Number} options.maxVisiblePages The maximum number of visible links to the pages (included the current one)
 * @param {Bool} options.showNextPageButton Default true
 * @param {Bool} options.showPrevPageButton Default true
 * */
function FuxOffsetPaginator(options) {

    /**
     * @param {Object[]} page.data The items of the page
     * @param {Number} page.max_items
     * @param {Number} page.total The number of total items of the pagination
     * @param {Number} page.prev The prev page
     * @param {Number} page.next The next page
     * @param {Number} page.pages Total pages
     * */
    const render = page => {
        if (options.itemsContainerClassName) itemsContainer.className = options.itemsContainerClassName;
        itemsContainer.innerHTML = '';
        paginationPage.data.map(i => itemsContainer.appendChild(options.onItemRender(i)));
        if (!paginationPage.data || !paginationPage.data.length) itemsContainer.appendChild(options.onEmptyPage());
        renderPaginationControls(page)
        if (options.onPageRendered) options.onPageRendered({...paginationPage});
    }

    const fetch = pageIndex => {
        //Using placeholders
        if (options.onItemSkeletonRender) {
            const placeholderNum = options.skeletonItemsNum || paginationPage.max_items || 5;
            itemsContainer.innerHTML = '';
            for (let i = 0; i < placeholderNum; i++) itemsContainer.appendChild(options.onItemSkeletonRender());
        }

        options.onPageRequest(pageIndex)
            .then(page => {
                paginationPage = {...page, total: page.total};
                lastFetchedPage = pageIndex;
                render(paginationPage);
            });
    }

    const handleGoPrev = _ => {
        currentPage -= 1;
        disablePagination();
        paginationPage.prev && fetch(paginationPage.prev);
    }
    const handleGoNext = _ => {
        currentPage += 1;
        disablePagination();
        paginationPage.next && fetch(paginationPage.next);
    }
    const handleGoTo = pageIndex => {
        currentPage = pageIndex;
        disablePagination();
        paginationPage.pages >= pageIndex && pageIndex > 0 && fetch(pageIndex);
    }

    /**
     * @param {Object[]} page.data The items of the page
     * @param {Number} page.max_items
     * @param {Number} page.total The number of total items of the pagination
     * @param {Number} page.prev The prev page
     * @param {Number} page.next The next page
     * @param {Number} page.pages Total pages
     * */
    const renderPaginationControls = page => {
        paginationNav.innerHTML = '';
        if (!page.prev && !page.next) {
            controlsContainer.style.display = 'none';
        } else {
            controlsContainer.style.display = null;
        }

        paginationLabel.innerHTML = `Pagina ${currentPage} di ${Math.ceil(page.total / page.max_items)}`

        const _createPaginationItem = (text, active) => {
            const el = document.createElement('li');
            el.className = `page-item ${active ? 'active' : ''}`;
            el.innerHTML = `<button class="page-link">${text}</button>`;
            paginationNav.appendChild(el);
            return el.querySelector('button');
        }


        //Prev button
        if (options.showPrevPageButton || options.showPrevPageButton === undefined) {
            _createPaginationItem('<i class="fas fa-chevron-left"></i>')
                .addEventListener('click', handleGoPrev);
        }

        //Pages buttons
        function calculatePaginationRange(maxButtons, totalPages, currentPage) {
            // Ensure currentPage is within valid range
            currentPage = Math.min(Math.max(currentPage, 1), totalPages);

            // Calculate the half of maxButtons to be displayed on each side of the current page
            const halfMaxButtons = Math.floor(maxButtons / 2);

            // Calculate the minimum and maximum buttons to be shown
            let minButton, maxButton;

            if (totalPages <= maxButtons) {
                // If total pages is less than or equal to maxButtons, show all buttons
                minButton = 1;
                maxButton = totalPages;
            } else {
                // Calculate the range of buttons based on the current page
                if (currentPage <= halfMaxButtons) {
                    // If current page is near the beginning
                    minButton = 1;
                    maxButton = maxButtons;
                } else if (currentPage + halfMaxButtons > totalPages) {
                    // If current page is near the end
                    minButton = totalPages - maxButtons + 1;
                    maxButton = totalPages;
                } else {
                    // If current page is in the middle
                    minButton = currentPage - halfMaxButtons;
                    maxButton = currentPage + halfMaxButtons;
                }
            }

            return [minButton, maxButton];
        }

        const [buttonsRangeStart, buttonsRangeEnd] = calculatePaginationRange(options.maxVisiblePages, paginationPage.pages, currentPage);

        for (let i = buttonsRangeStart; i < currentPage; i++) {
            _createPaginationItem(i)
                .addEventListener('click', _ => handleGoTo(i));
        }
        for (let i = currentPage; i <= buttonsRangeEnd; i++) {
            _createPaginationItem(i, i === currentPage)
                .addEventListener('click', _ => handleGoTo(i));
        }

        //Next button
        if (options.showNextPageButton || options.showNextPageButton === undefined) {
            _createPaginationItem('<i class="fas fa-chevron-right"></i>')
                .addEventListener('click', handleGoNext);
        }
    }

    const disablePagination = _ => {
        [...Array.from(controlsContainer.querySelector('.pagination .page-link'))].map(b => b.disabled = true);
    }

    let paginationPage = {
        data: [], //The items of the page
        max_items: 0,
        total: 0, //The number of total items of the pagination
        prev: '', //The prev page
        next: '', //The next page
        pages: 0, //Total pages
    };
    let currentPage = 1;
    let lastFetchedPage = null;

    const itemsContainer = options.controlsContainer ? options.container : document.createElement('div');
    const controlsContainer = document.createElement('div');
    controlsContainer.innerHTML = `
        <div class="d-flex justify-content-center" style="display: none;">
            <nav class="text-center">
                <ul class="pagination"></ul>
                <span data-role="label">Pagina 1 di 1</span>
            </nav>
        </div>
        `;

    const paginationNav = controlsContainer.querySelector('nav .pagination');
    const paginationLabel = controlsContainer.querySelector('[data-role="label"]');

    if (options.controlsContainer) {
        options.controlsContainer.appendChild(controlsContainer);
    } else {
        options.container.appendChild(itemsContainer);
        options.container.appendChild(controlsContainer);
    }

    fetch(null);

    return {
        reset: function () {
            paginationPage = {
                data: [], //The items of the page
                max_items: 0,
                total: 0, //The number of total items of the pagination
                prev: '', //The prev page
                next: '', //The next page
                pages: '', //Total number of pages
            };
            currentPage = 1;
            fetch(1);
        },
        refresh: function () {
            fetch(lastFetchedPage);
        },
        getItems: function () {
            return paginationPage.data
        }
    }
}


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

FuxOffsetPaginator.utility = {
    basicSkeletonRender: (w, h, inline, margin) => _ => {
        const el = document.createElement('div');
        el.className = `card border-0 p-2 shadow-sm ${margin ? '' : 'mb-1'} skeleton-placeholder`;
        if (w) el.style.width = w + "px";
        if (h) el.style.height = h + "px";
        if (inline) el.style.display = "inline-block";
        if (margin) el.style.margin = margin;
        return el;
    },
    tableRowSkeletonRender: (w, h) => _ => {
        const row = document.createElement('tr');
        const skeleton = document.createElement('td');
        skeleton.className = 'skeleton-placeholder'
        skeleton.colSpan = 999;
        if (w) skeleton.style.width = w + "px";
        if (h) skeleton.style.height = h + "px";
        row.appendChild(skeleton)
        return row;
    }
}
