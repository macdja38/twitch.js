const snekfetch = require('snekfetch');
const endpoints = require('./endpoints');
const constants = require('./constants');

class twitchAPI {
    constructor(options) {
        this.headers = {
            Accept: 'application/vnd.twitchtv.v5+json',
        };
        Object.assign(this.headers, options.headers);
    }


    fetch(endpoint) {
        return constants.ROOT_URL + endpoints[endpoint];
    }

    async request(endpoint, headers, params) {
        this.url = this.fetch(endpoint);
        let res;

        try {
            res = await snekfetch.get(this.url, { headers, query: { params } });
        } catch (error) {
            return error;
        }

        if (res.status !== 200) { throw new Error(res.statusText); }
        return res.body.data;
    }
}

module.exports = twitchAPI;
