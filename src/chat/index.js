const WebSocket = require('ws');

class twitchChat {
    /**
     * Create a new api method
     * @class
     * @param {Object} [options] - options
     * @param {string} [options.url] - websocket connection url
     * @since 0.0.1
     * @constructor
     */
    constructor(options) {
        this.options = {
            url: 'wss://irc-ws.chat.twitch.tv',
        };
        this.client = null;
        this.ready = null;
    }

    /**
     * establish connection to chat servers
     * @since 0.0.1
     */
    connect() {
        if (this.ready) throw (new Error('Client connection already established.'));
    }
}

module.exports = twitchChat;
