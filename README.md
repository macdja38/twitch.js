## About
A new lib for interfacing with twitch api and chat servers

## Installation
**Node.js 8.0.0 or newer is required.**
```sh
npm install github:twitch-js/twitch.js --save
```

## Example API
```js
const config = { 'Client-ID': 'CLIENT_ID' };
const twitch = require('twitch.js');
const client = new twitch(config);

console.log(client.api);

(async () => {
    let res;

    try {
        res = await client.api.getUsers(['rosiecode']);
    } catch (error) {
        console.error(error);
    }

    console.log(`the user-id for ${res.users[0].display_name} is: ${res.users[0]._id}`);
})();

```

## Example Chat
```js
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

```

## Contributing
have an issue? check current issues before reporting

[Documentation](https://twitch-js.github.io/twitch.js/)
