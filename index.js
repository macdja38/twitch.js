const twitch = {
    chat: './src/chat/index',
    api: './src/api/index',
};

module.exports = (name) => require(twitch[name]);
