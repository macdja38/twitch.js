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

        let api = require('./../api/index');
        this.api = new api({ headers: { 'Client-ID': this.options['Client-ID'] } });
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
            if (message !== null) {
                let coms = message.split('\r');

                coms.forEach(element => {
                    element = element.replace(/\r?\n|\r/g, '');

                    this.emit('debug', element);
                    const parsed = this.parseMessage(element);

                    if (parsed !== null) {
                        if (parsed.method === 'PRIVMSG') {
                            this.emit('message', parsed);
                        } else if (parsed.method === 'PING') {
                            this.client.send(`PONG :${parsed.message}`);
                        } else if (parsed.method === 'JOIN') {
                            this.emit('JOIN', { channel: parsed.channel, user: parsed.author });
                        } else if (parsed.method === 'PART') {
                            this.emit('PART', { channel: parsed.channel, user: parsed.author });
                        }
                    }
                });
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
            originalSplit: rawMessage.split(' '),
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
            parsedMessage.content = parsedMessage.content;

            parsedMessage.send = (message) => {
                const channel = parsedMessage.channel;
                this.sendMessage(channel, message);
            };

            parsedMessage.reply = (message) => {
                const channel = parsedMessage.channel;
                const author = parsedMessage.author;
                this.sendMessage(channel, `@${author}, ${message}`);
            };
        } else if (rawMessage.startsWith('PING')) {
            parsedMessage.method = 'PING';
            parsedMessage.content = rawMessage.split(':')[1];
        } else if (parsedMessage.originalSplit[1] === 'JOIN') {
            parsedMessage.method = 'JOIN';
            parsedMessage.channel = parsedMessage.originalSplit[2];
            parsedMessage.author = parsedMessage.originalSplit[0].split('!')[0].substr(1);
        } else if (parsedMessage.originalSplit[1] === 'PART') {
            parsedMessage.method = 'PART';
            parsedMessage.channel = parsedMessage.originalSplit[2];
            parsedMessage.author = parsedMessage.originalSplit[0].split('!')[0].substr(1);
        } else {
            console.error('unkown event', rawMessage);
            this.emit('error', new Error('Unkown event state'));
        }

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
