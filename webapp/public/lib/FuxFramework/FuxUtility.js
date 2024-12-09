/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param baseObject
 * @param overrideObject
 * @returns obj3 a new object based on obj1 and obj2
 */

var FuxUtility = {
    mergeObjects: function (baseObject, overrideObject) {
        var obj3 = {};
        for (var attrname in baseObject) {
            obj3[attrname] = baseObject[attrname];
        }
        for (var attrname in overrideObject) {
            obj3[attrname] = overrideObject[attrname];
        }
        return obj3;
    },
    validateEmail: function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    isFunction: function (functionToCheck) {
        return functionToCheck && ['[object Function]', '[object AsyncFunction]'].indexOf({}.toString.call(functionToCheck)) > -1;
    },
    getPasswordStrength: function (pwd) {
        var array = [];
        array[0] = pwd.match(/[A-Z]/);
        array[1] = pwd.match(/[a-z]/);
        array[2] = pwd.match(/\d/);
        array[3] = pwd.match(/[@#$\.%^&+=?!"£\/()*-_\[\]]/);

        var sum = 0;
        for (var i = 0; i < array.length; i++) {
            sum += array[i] ? 1 : 0;
        }

        console.log(array, sum);
        return sum;
    },
    extend: function (proto, literal) {
        var result = Object.create(proto);
        Object.keys(literal).forEach(function (key) {
            result[key] = literal[key];
        });
        return result;
    },
    copyToClipboard: function (text) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text);
            return;
        }
        var toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        navigator.clipboard.writeText(text).then(function () {
            toast({
                type: 'success',
                title: 'Testo copiato nella clipboard'
            });
        }, function (err) {
            toast({
                type: 'error',
                title: 'Impossibile copiare il testo',
                text: err
            });
        });
    },
    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns {String} => iOS | Android | Windows Phone | unknown
     */
    getMobileOperatingSystem: function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }

        if (/android/i.test(userAgent)) {
            return "Android";
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }

        return "unknown";
    },
    waitForElement: function (querySelector, timeout, parent) {
        if (!parent) {
            parent = document;
        }
        return new Promise(function (resolve, reject) {
            var interval = setInterval(function () {
                let el = parent.querySelector(querySelector);
                if (el) {
                    clearInterval(interval);
                    resolve(el);
                }
            }, timeout);
        });
    }
};

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

function isFunction(f) {
    return FuxUtility.isFunction(f);
}

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1)
};

if (!Array.prototype.includes) {
    Array.prototype.includes = function (searchElement /*, fromIndex*/) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.includes called on null or undefined');
        }

        var O = Object(this);
        var len = parseInt(O.length, 10) || 0;
        if (len === 0) {
            return false;
        }
        var n = parseInt(arguments[1], 10) || 0;
        var k;
        if (n >= 0) {
            k = n;
        } else {
            k = len + n;
            if (k < 0) {
                k = 0;
            }
        }
        var currentElement;
        while (k < len) {
            currentElement = O[k];
            if (searchElement === currentElement ||
                (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
                return true;
            }
            k++;
        }
        return false;
    };
}
;

document.getElementByTagName = function (tagName) {
    return document.getElementsByTagName(tagName)[0];
};
