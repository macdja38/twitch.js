const snekfetch = require('snekfetch');
const endpoints = require('./endpoints');
const constants = require('./constants');

class BaseRequest {
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
