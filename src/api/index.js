const snekfetch = require('snekfetch');
const endpoints = require('./endpoints');
const constants = require('./constants');

class twitchAPI {
    /**
     * Create a new api method
     * @class
     * @param {Object} [options] - options
     * @param {Object} [options.headers] - method headers
     * @param {string} [options.headers.Accept] - application type (defaults to v5)
     * @param {string} [options.headers.Client-ID] - twitch clientID token
     * @since 0.0.1
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

    /**
     * Build string for targeted endpoint.
     *
     * @async
     * @param {string} end - endpoint name.
     * @param {string} params - endpoint params.
     * @returns {string} built string for requested endpoint.
     */
    async fetch(end, params) {
        return this.constants.ROOT_URL + this.endpoints[end](params);
    }

    /**
     * makes request to twitch api using supplied data.
     *
     * @async
     * @param {string} end - endpoint name.
     * @param {string} params - endpoint params.
     * @returns {Promise<Object>} request data.
     */
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

module.exports = twitchAPI;
