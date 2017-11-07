
## About
a new lib for interfacing with twitch api and chat servers

## [Documentation](https://twitch-js.github.io/twitch.js/)

## Installation
**Node.js 8.0.0 or newer is required.**  
npm install github:twitch-js/twitch.js --save


## Example API
```js
const twitch = require('twitch.js')('api');
const api = new twitch({ headers: { 'Client-ID': '*CLIENT-ID' } });

api.request('USERS', { login: 'RosieCode' }).then(console.log).catch(console.error);
```


## Contributing
have an issue? check current issues before reporting
