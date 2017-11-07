const WebSocket = require('ws');

class BaseClass {
    constructor(options) {
        this.options = {
            url: 'wss://irc-ws.chat.twitch.tv',
        };
        this.client = null;
        this.ready = null;
    }

    connect() {
        if (this.ready) throw (new Error('Client connection already established.'));
    }
}

module.exports = BaseClass;
