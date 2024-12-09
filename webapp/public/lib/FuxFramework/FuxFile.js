const FuxFile = {
    /**
     * Create a CSV Blob file
     *
     * @param {Array[]} rows Each i-th element is a row and each j-th element of the i-th row is a cell value
     * @param {Array|undefined} headers
     *
     * @return {Blob}
     * */
    createCsv: function (rows, headers) {
        if (!rows) throw new Error("The 'rows' param have to be an array or iterable object");
        if (headers && rows.length && rows[0].length !== headers.length) throw new Error("Header columns number should have the same size of each row");

        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                }
                ;
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        let csvContent = '';
        if (headers) csvContent += processRow(headers);
        csvContent += rows.map(r => processRow(r)).join("");

        return new Blob([csvContent], {type: 'text/csv;charset=utf-8;'});
    },
    /**
     * Download a blob file
     *
     * @param {String} filename
     * @param {Blob} blob
     *
     * @return {void}
     * */
    downloadFile: function (filename, blob) {
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    },
    /**
     * Create an HTML representation of a table with passed arguments. Then it opens a new window and programmatically
     * call the "window.print()" statement.
     *
     * @param {String} filename Each i-th element is a row and each j-th element of the i-th row is a cell value
     * @param {Array} headers
     * @param {Array[]} rows Each i-th element is a row and each j-th element of the i-th row is a cell value
     *
     * @return {Blob}
     * */
    printRowsAsTable: function (filename, headers, rows) {

        var w = window.open('', 'Print-Window', /*`height=800,width=600`*/);

        const dce = (tag, props = {}, attrs = {}, ch = []) => ch.reduce((e, c) => (e.appendChild(c), e), Object.entries(attrs).reduce((e, [k, v]) => (e.setAttribute(k, v), e), Object.assign(document.createElement(tag), props)))

        const tableStyle = {
            width: '21cm',
            fontFamily: 'Helvetica, sans-serif',
            borderCollapse: "collapse",
            border: "1px solid #ddd"
        };
        const tableChilds = [];

        if (headers) {
            tableChilds.push(
                dce('thead', {}, {}, [
                        dce('tr', {}, {},
                            headers.map(h => dce('th', {innerText: h}, {scope: 'col'}))
                        )
                    ]
                )
            )
        }

        if (rows) {
            tableChilds.push(
                dce('tbody', {}, {},
                    rows.map(r => dce('tr', {}, {},
                        r.map(c => dce('td', {innerText: c}))
                    ))
                )
            )
        }

        const table = dce('table', {}, {border:1}, tableChilds)
        Object.keys(tableStyle).map(s => table.style[s] = tableStyle[s]);

        w.document.title = filename;
        w.document.body.appendChild(table);
        w.document.body.onload = _ => w.print();
        //setTimeout(_ => w.close(), 1000);
    }
};