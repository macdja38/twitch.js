const snekfetch = require('snekfetch');
const endpoints = require('./endpoints');
const constants = require('./constants');

class twitchAPI {
    /**
     * Creates an instance of twitchAPI.
     * @class
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

    /**
     * Build string for targeted endpoint.
     * 
     * @async
     * @param {string} endpoint - endpoint name.
     * @param {string} params - endpoint params.
     * @returns {string} built string for requested endpoint.
     */
    async fetch(endpoint, params) {
        return this.constants.ROOT_URL + this.endpoints[endpoint](params);
    }
    /**
     * makes request to twitch api using supplied data.
     * 
     * @async
     * @param {string} endpoint - endpoint name.
     * @param {string} params - endpoint params.
     * @returns {Promise<Object>} request data.
     */
    request(endpoint, params) {
        return new Promise(async (resolve, reject) => {
            try {
                this.url = await this.fetch(endpoint, params);
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

    // HELIX

    /**
     * @typedef games
     * @property {Object} index - object responce index
     * @property {object} index.box_art_url - Template URL for the game’s box art.
     * @property {string} index.id - Game ID.
     * @property {string} index.name - Game name.
     */

    /**
     * Gets game information by game ID or name.
     * 
     * @param {Object} [params] - 
     * @param {string} [params.id] - Game ID. At most 100 id values can be specified.
     * @param {string} [params.name] - Game name. The name must be an exact match. For instance, "Pokemon" will not return a list of Pokemon games; instead, query the specific Pokemon game(s) in which you are interested. At most 100 name values can be specified.
     * @returns {Promise<games>} request data.
     */
    games(params) { return this.request('GAMES', params); }

    /**
     * @typedef streams
     * @property {Object} index - object responce index
     * @property {string[]} index.community_ids - Array of community IDs.
     * @property {string} index.game_id - ID of the game being played on the stream.
     * @property {string} index.id - Stream ID.
     * @property {string} index.language - Stream language.
     * @property {string} index.pagination - A cursor value, to be used in a subsequent request to specify the starting point of the next set of results.
     * @property {string} index.started_at - UTC timestamp.
     * @property {string} index.thumbnail_url - Thumbnail URL of the stream. All image URLs have variable width and height. You can replace `{width}` and `{height}` with any values to get that size image
     * @property {string} index.title - Stream title.
     * @property {string} index.type - Stream type: `"live"`, `"vodcast"`, `"playlist"`, or `""`.
     * @property {string} index.user_id - ID of the user who is streaming.
     * @property {integer} index.viewer_count - Number of viewers watching the stream at the time of the query.
     */

    /**
     * Gets information about active streams. Streams are returned sorted by number of current viewers, in descending order. Across multiple pages of results, there may be duplicate or missing streams, as viewers join and leave streams.
     * 
     * @param {Object} [params] - 
     * @param {string} [params.after] - Cursor for forward pagination: tells the server where to start fetching the next set of results, in a multi-page response.
     * @param {string} [params.before] - Cursor for backward pagination: tells the server where to start fetching the next set of results, in a multi-page response.
     * @param {string} [params.community_id] - Returns streams in a specified community ID. You can specify up to 100 IDs.
     * @param {integer} [params.first] - Maximum number of objects to return. Maximum: 100. Default: 20.
     * @param {string} [params.game_id] - Returns streams broadcasting a specified game ID. You can specify up to 100 IDs.
     * @param {string} [params.language] - Stream language. You can specify up to 100 languages.
     * @param {string} [params.type] - Stream type: `"all"`, `"live"`, `"vodcast"`. Default: `"all"`.
     * @param {string} [params.user_id] - Returns streams broadcast by one or more specified user IDs. You can specify up to 100 IDs.
     * @param {string} [params.user_login] - Returns streams broadcast by one or more specified user login names. You can specify up to 100 names.
     * @returns {Promise<streams>} request data.
     */
    streams(params) { return this.request('STREAMS', params); }

    /**
     * Gets metadata information about active streams playing Overwatch or Hearthstone. Streams are sorted by number of current viewers, in descending order. Across multiple pages of results, there may be duplicate or missing streams, as viewers join and leave streams.
     * 
     * @param {Object} [params] - 
     * @returns {Promise<Object>} request data.
     */
    streamsMetadata(params) { return this.request('STREAMS_METADATA', params); }

    /**
     * 	Gets information about one or more specified Twitch users. Users are identified by optional user IDs and/or login name. If neither a user ID nor a login name is specified, the user is looked up by Bearer token.
     * 
     * @param {Object} [params] - 
     * @returns {Promise<Object>} request data.
     */
    users(params) { return this.request('USERS', params); }

    /**
     * Gets information on follow relationships between two Twitch users. Information returned is sorted in order, most recent follow first. This can return information like "who is lirik following," "who is following lirik,” or “is user X following user Y.”
     * 
     * @param {Object} [params] - 
     * @returns {Promise<Object>} request data.
     */
    usersFollows(params) { return this.request('USERS_FOLLOWS', params); }

    /**
     * Gets video information by video ID (one or more), user ID (one only), or game ID (one only).
     * 
     * @param {Object} [params] - 
     * @returns {Promise<Object>} request data.
     */
    videos(params) { return this.request('VIDEOS', params); }

    // KRAKEN

}

module.exports = twitchAPI;
