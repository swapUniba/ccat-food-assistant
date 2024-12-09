var FuxHTTP = {
    RESOLVE_DATA: 1,
    RESOLVE_MESSAGE: 2,
    RESOLVE_RESPONSE: 3,
    REJECT_DATA: 4,
    REJECT_MESSAGE: 5,
    REJECT_RESPONSE: 6,
    STATUS_SUCCESS: 'OK',
    STATUS_ERROR: 'ERROR',
    DRIVER_JQUERY: 'jquery',
    DRIVER_FETCH: 'fetch',
    getCookie: function (cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    },
    doRequest: function (method, url, params, resolveMode, rejectMode, driver) {

        if (driver === FuxHTTP.DRIVER_FETCH) {
            if (method === 'GET' && params) {
                const newUrl = new URL(url);
                const newParams = new URLSearchParams(params);
                for (let [key, val] of newParams.entries()) newUrl.searchParams.append(key, val);
                url = newUrl.toString();
            }else if(method === 'POST'){
                const xsrf_token = FuxHTTP.getCookie('XSRF-TOKEN');
                if (xsrf_token) params['_token'] = xsrf_token;
            }
            return FuxHTTP.__fetch(method, url, method === 'POST' ? params : undefined, resolveMode, rejectMode)
        }

        var http = null;
        switch (method) {
            case 'GET':
                http = $.get;
                break;
            case 'POST':
                const xsrf_token = FuxHTTP.getCookie('XSRF-TOKEN');
                if (xsrf_token) params['_token'] = xsrf_token;
                http = $.post;
                break;
            default:
                http = $.get;
                break;
        }
        return new Promise(function (resolve, reject) {
            http(url, params, function (jsonResponse) {
                FuxHTTP.__handleResponse(jsonResponse, resolve, reject, resolveMode, rejectMode)
            });
        });
    },
    __handleResponse: function (json, resolveCb, rejectCb, resolveMode, rejectMode) {
        if (json.status === FuxHTTP.STATUS_SUCCESS) {
            switch (resolveMode) {
                case FuxHTTP.RESOLVE_DATA:
                    resolveCb(json.data);
                    break;
                case FuxHTTP.RESOLVE_MESSAGE:
                    resolveCb(json.message);
                    break;
                default:
                    resolveCb(json);
                    break;
            }
        } else {
            switch (rejectMode) {
                case FuxHTTP.REJECT_DATA:
                    rejectCb(json.data);
                    break;
                case FuxHTTP.REJECT_MESSAGE:
                    rejectCb(json.message);
                    break;
                default:
                    rejectCb(json);
                    break;
            }
        }
    },
    get: function (url, params, resolveMode, rejectMode, driver) {
        return FuxHTTP.doRequest('GET', url, params, resolveMode, rejectMode, driver);
    },
    post: function (url, body, resolveMode, rejectMode, driver) {
        return FuxHTTP.doRequest('POST', url, body, resolveMode, rejectMode, driver);
    },
    __fetch: function (method, url, body, resolveMode, rejectMode) {
        return new Promise((resolve, reject) => {
            fetch(url, {method: method, body: body})
                .then(response => response.json())
                .then(json => {
                    FuxHTTP.__handleResponse(json, resolve, reject, resolveMode, rejectMode)
                })
                .catch(error => {
                    FuxHTTP.__handleResponse({
                        status: FuxHTTP.STATUS_ERROR,
                        message: "Errore inatteso, riprova più tardi",
                        data: error,
                    }, resolve, reject, resolveMode, rejectMode)
                });
        })
    },
    createFormDataFromObject: function (object) {
        const formData = new FormData();
        const populateFormData = function (baseFormData, obj, subKeyStr = '') {
            for (let i in obj) {
                let value = obj[i];
                let subKeyStrTrans = subKeyStr ? subKeyStr + '[' + i + ']' : i;

                if (typeof (value) === 'string' || typeof (value) === 'number') {
                    baseFormData.append(subKeyStrTrans, value);
                } else if (typeof (value) === 'object') {
                    populateFormData(baseFormData, value, subKeyStrTrans);
                }
            }
        }

        populateFormData(formData, object);
        return formData;
    }
};
