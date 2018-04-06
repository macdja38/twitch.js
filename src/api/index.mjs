import snekfetch from 'snekfetch';
import {encodeHelixObject, encodeKrakenObject} from "../lib/encodeURIParams";

const ROOT_URL = 'https://api.twitch.tv';

class twitchAPI {
    constructor(options) {
        this.headers = {};
        Object.assign(this.headers, options.headers);
    }

    async request(url, headers, params) {
        let res;

        const context = {};
        if (headers) { context.headers = headers; }
        if (params) { context.query = params; }

        try {
            res = await snekfetch.get(url, context);
        } catch (error) {
            return error;
        }

        if (res.status !== 200) { throw new Error(res.statusText, res); }
        return res.body;
    }

    getUsers(users) {
        if (!users) { throw new Error('Missing users paramiter'); }
        if (!Array.isArray(users)) { throw new Error('Users must be an Array'); }
        if (users.length === 0) { throw new Error('Users Array must not be empty'); }

        const url = `${ROOT_URL}/kraken/users?${encodeKrakenObject({login: users})}`;
        return this.request(url, { 'Client-ID': this.headers['Client-ID'], Accept: 'application/vnd.twitchtv.v5+json' });
    }

    getUsersByID(users) {
        if (!users) {
            throw new Error('Missing users paramiter');
        }
        if (!Array.isArray(users)) {
            throw new Error('Users must be an Array');
        }
        if (users.length === 0) {
            throw new Error('Users Array must not be empty');
        }

        const url = `${ROOT_URL}/helix/users?${encodeHelixObject({id: users})}`;
        return this.request(url, {'Client-ID': this.headers['Client-ID'], Accept: 'application/vnd.twitchtv.v5+json'});
    }

    getUsersByLogin(users) {
        if (!users) {
            throw new Error('Missing users paramiter');
        }
        if (!Array.isArray(users)) {
            throw new Error('Users must be an Array');
        }
        if (users.length === 0) {
            throw new Error('Users Array must not be empty');
        }

        const url = `${ROOT_URL}/kraken/users?${encodeHelixObject({login: users})}`;
        return this.request(url, {'Client-ID': this.headers['Client-ID'], Accept: 'application/vnd.twitchtv.v5+json'});
    }
}

export default twitchAPI;
