const twitch = require('./../index');
const config = { username: '<USERNAME>', oauth: 'oauth:<AUTH_TOKEN>' };
const client = new twitch(config);

client.on('message', (message) => { console.log(`${message.author} : ${message.content}`); });

client.on('disconnected', () => { console.log('[INFO]', 'DISCONNECTED FROM WS'); });
client.on('debug', (debug) => { console.log(`[DEBUG] ${debug}`); });

client.on('JOIN', ({ channel, user }) => { console.log(channel, user); });
client.on('PART', ({ channel, user }) => { console.log(channel, user); });

client.on('ready', () => {
    console.log('ready!');
    client.join('rosiecode'); // Join a channel
});

client.connect();
