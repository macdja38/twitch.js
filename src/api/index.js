const snekfetch = require('snekfetch');
const endpoints = require('./endpoints');
const constants = require('./constants');

class BaseRequest {
    /**
     * Create a new api method
     * @param {Object} [options] - options
     * @param {Object} [options.headers] - method headers
     * @param {string} [options.headers.Accept] - application type (defaults to v5)
     * @param {string} [options.headers.Client-ID] - twitch clientID token
     * @constructor
     */
    constructor(options) {
        this.headers = {
            Accept: 'application/vnd.twitchtv.v5+json',
        };
        Object.assign(this.headers, options.headers);
        this.constants = constants;
        this.endpoints = endpoints;
    }

    async fetch(end, params) {
        return this.constants.ROOT_URL + this.endpoints[end](params);
    }

    request(end, params) {
        return new Promise(async (resolve, reject) => {
            try {
                this.url = await this.fetch(end, params);
            } catch (error) {
                reject(error);
            }

            try {
                let res = await snekfetch.get(this.url, { headers: this.headers });
                if (res.status !== 200) { reject(new Error(res.statusText)); }
                resolve(res.body.data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = BaseRequest;
