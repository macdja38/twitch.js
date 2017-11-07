const config = require('./config.json');
const twitchAPI = require('./../index')('api');
const api = new twitchAPI({ headers: { 'Client-ID': config.clientID } });

// api.request('GAMES', { name: 'osu!' }).then(console.log).catch(console.error);
// api.request('USERS', { login: 'RosieCode' }).then(console.log).catch(console.error);
// api.request('USERS', { id: '53524279' }).then(console.log).catch(console.error);

api.request('USERS_FOLLOWS', { from_id: 53524279, to_id: 154508651 }).then(console.log).catch(console.error);

