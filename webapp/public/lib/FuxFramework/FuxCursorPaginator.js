/**
 * Create a customizable cursor pagination system
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
 * */
function FuxCursorPaginator(options) {

    /**
     * @param {Object[]} page.data The items of the page
     * @param {Number} page.max_items
     * @param {Number} page.total The number of total items of the pagination
     * @param {String} page.prev The prev cursor
     * @param {String} page.next The next cursor
     * */
    const render = page => {
        if (options.itemsContainerClassName) itemsContainer.className = options.itemsContainerClassName;
        itemsContainer.innerHTML = '';
        paginationPage.data.map(i => itemsContainer.appendChild(options.onItemRender(i)))
        if (!paginationPage.data || !paginationPage.data.length) {
            itemsContainer.appendChild(options.onEmptyPage());
        }

        if (!page.prev && !page.next) {
            controlsContainer.style.display = 'none';
        } else {
            controlsContainer.style.display = null;
        }

        prevBtn.disabled = !page.prev;
        nextBtn.disabled = !page.next;

        paginationLabel.innerHTML = `Pagina ${currentPage} di ${Math.ceil(page.total / page.max_items)}`
        if (options.onPageRendered) options.onPageRendered({...paginationPage});
    }

    const fetch = cursor => {
        //Using placeholders
        if (options.onItemSkeletonRender) {
            const placeholderNum = options.skeletonItemsNum || paginationPage.max_items || 5;
            itemsContainer.innerHTML = '';
            for (let i = 0; i < placeholderNum; i++) itemsContainer.appendChild(options.onItemSkeletonRender());
        }

        options.onPageRequest(cursor)
            .then(page => {
                //The field "total" has the correct info only when cursor is null, otherwise it contains wrong informations
                // caused by conditions injected in the query based on the cursor settings.
                paginationPage = {...page, total: cursor ? paginationPage.total : page.total};
                lastFetchedCursor = cursor;
                render(paginationPage);
            });
    }

    const handleGoPrev = _ => {
        currentPage -= 1;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        paginationPage.prev && fetch(paginationPage.prev);
    }
    const handleGoNext = _ => {
        currentPage += 1;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        paginationPage.next && fetch(paginationPage.next);
    }


    let paginationPage = {
        data: [], //The items of the page
        max_items: 0,
        total: 0, //The number of total items of the pagination
        prev: '', //The prev cursor
        next: '' //The next cursor
    };
    let currentPage = 1;
    let lastFetchedCursor = null;

    const itemsContainer = options.controlsContainer ? options.container : document.createElement('div');
    const controlsContainer = document.createElement('div');
    controlsContainer.innerHTML = `
        <div class="d-flex justify-content-center" style="display: none;">
            <nav class="text-center">
                <ul class="pagination">
                    <li class="page-item"><button class="page-link" data-role="prev">Precedente</button></li>
                    <li class="page-item"><button class="page-link" data-role="next">Successivo</button></li>
                </ul>
                <span data-role="label">Pagina 1 di 1</span>
            </nav>
        </div>
        `;
    const paginationLabel = controlsContainer.querySelector('[data-role="label"]');
    const prevBtn = controlsContainer.querySelector('[data-role="prev"]');
    prevBtn.addEventListener('click', handleGoPrev);
    const nextBtn = controlsContainer.querySelector('[data-role="next"]');
    nextBtn.addEventListener('click', handleGoNext);

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
                prev: '', //The prev cursor
                next: '' //The next cursor
            };
            currentPage = 1;
            fetch(null);
        },
        refresh: function (){
            fetch(lastFetchedCursor);
        },
        getItems: function (){
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
        .skeleton-placeholder::after{
            display:block;
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

FuxCursorPaginator.utility = {
    basicSkeletonRender: (w, h, inline, margin) => _ => {
        const el = document.createElement('div');
        el.className = `card border-0 p-2 shadow-sm ${margin ? '': 'mb-1'} skeleton-placeholder`;
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
