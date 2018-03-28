const config = { 'Client-ID': 'CLIENT_ID' };
const twitch = require('./../index');
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
