let EventEmitter;
try { EventEmitter = require('eventemitter3'); } catch (e) { EventEmitter = require('events').EventEmitter; }

let WebSocket;
try { WebSocket = require('uws'); } catch (e) { WebSocket = require('ws'); }

class twitchChat extends EventEmitter {
    constructor(options) {
        super();

        this.options = {
            username: options.username,
            oauth: options.oauth,
            server: 'irc-ws.chat.twitch.tv',
            port: 443,
        };

        Object.assign(this.options, options);

        this.client = null;
        this.ready = null;
    }

    connect() {
        this.client = new WebSocket(`wss://${this.options.server}:${this.options.port}/`);

        this.client.on('open', () => {
            if (this.client !== null && this.client.readyState === 1) {
                this.emit('debug', 'Connecting and authenticating...');
                this.client.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
                this.client.send(`PASS ${this.options.oauth}`);
                this.client.send(`NICK ${this.options.username}`);
            } else {
                throw new Error('incorrect socket readyState: ', this.client.readyState);
            }

            this.emit('debug', 'Connection opened.');
            this.emit('ready');
        });

        this.client.on('message', (message) => {
            this.emit('debug', message);

            if (message !== null) {
                var parsed = this.parseMessage(message);
                if (parsed !== null) {
                    if (parsed.method === 'PRIVMSG') {
                        this.emit('message', parsed);
                    } else if (parsed.method === 'PING') {
                        this.client.send(`PONG :${parsed.message}`);
                    }
                }
            }
        });

        this.client.on('close', () => { this.emit('disconnected'); });
    }

    parseMessage(rawMessage) {
        const parsedMessage = {
            content: null,
            tags: null,
            method: null,
            original: rawMessage,
            channel: null,
            author: null,
        };

        if (rawMessage[0] === '@') {
            const tagIndex = rawMessage.indexOf(' ');
            const userIndex = rawMessage.indexOf(' ', tagIndex + 1);
            const commandIndex = rawMessage.indexOf(' ', userIndex + 1);
            const channelIndex = rawMessage.indexOf(' ', commandIndex + 1);
            const messageIndex = rawMessage.indexOf(':', channelIndex + 1);

            parsedMessage.tags = rawMessage.slice(0, tagIndex);
            parsedMessage.author = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
            parsedMessage.method = rawMessage.slice(userIndex + 1, commandIndex);
            parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
            parsedMessage.content = rawMessage.slice(messageIndex + 1);
            parsedMessage.content = parsedMessage.content.slice(0, -2);
        } else if (rawMessage.startsWith('PING')) {
            parsedMessage.method = 'PING';
            parsedMessage.content = rawMessage.split(':')[1];
        }

        parsedMessage.send = (message) => {
            const channel = parsedMessage.channel;
            this.sendMessage(channel, message);
        };

        parsedMessage.reply = (message) => {
            const channel = parsedMessage.channel;
            const author = parsedMessage.author;
            this.sendMessage(channel, `@${author}, ${message}`);
        };


        return parsedMessage;
    }

    join(channel) {
        if (!channel.startsWith('#')) { channel = `#${channel}`; }
        this.client.send(`JOIN ${channel}`);
    }

    sendMessage(channel, message) {
        if (!channel.startsWith('#')) { channel = `#${channel}`; }
        this.client.send(`PRIVMSG ${channel} :${message}`);
    }
}

module.exports = twitchChat;
