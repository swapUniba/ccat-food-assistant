const FuxEvents = {
    events: {},
    eventsFireRegistry: {},
    on: function (eventName, fn) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(fn);
    },
    off: function (eventName, fn) {
        if (this.events[eventName]) {
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i] === fn) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            }
        }
    },
    offAll: function (eventName){
        if (this.events[eventName]) this.events[eventName] = [];
    },
    remove: function (eventName) {
        if (this.events[eventName]) {
            this.events[eventName] = [];
        }
    },
    emit: function (eventName, data) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(function (fn) {
                fn(data);
            });
        }
        this.eventsFireRegistry[eventName] = 1 + (this.eventsFireRegistry[eventName] ?? 0)
    },
    waitForEvent: function (appEventName) {
        return new Promise(resolve => {
            const listener = _ => {
                FuxEvents.off(appEventName, listener);
                resolve();
            }
            FuxEvents.on(appEventName, listener);
        });
    },
    getFiresNumber: function (eventName) {
        return this.eventsFireRegistry[eventName] ?? 0;
    }
};
