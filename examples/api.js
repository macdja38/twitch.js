const config = require('./config.json');
const twitch = require('./../index')('api');
const api = new twitch({ headers: { 'Client-ID': config.clientID } });

// api.request('GAMES', { name: 'osu!' }).then(console.log).catch(console.error);
api.request('USERS', { login: 'RosieCode' }).then(console.log).catch(console.error);
