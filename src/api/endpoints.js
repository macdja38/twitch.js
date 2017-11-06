module.exports.GAMES = (params) => `/games?id=${params.id}&name=${params.name}`;
module.exports.STREAMS = (params) => `/streams?after=${params.after}&before=${params.before}&community_id=${params.community_id}&first=${params.first}&game_id=${params.game_id}&language=${params.language}&type=${params.type}&user_id=${params.user_id}&user_login=${params.user_login}`;
module.exports.STREAMS_METADATA = (params) => `/streams/metadata?after=${params.after}&before=${params.before}&community_id=${params.community_id}&first=${params.first}&game_id=${params.game_id}&language=${params.language}&type=${params.type}&user_id=${params.user_id}&user_login=${params.user_login}`;
module.exports.USERS = (params) => `/users?login=${params.login}&id=${params.id}`;
module.exports.USERS_FOLLOWS = (params) => `/users/follows?after=${params.after}&before=${params.before}&first=${params.first}&from_id=${params.from_id}&to_id=${params.to_id}`;
module.exports.VIDEOS = (params) => `/videos?id=${params.id}&user_id=${params.user_id}&game_id=${params.game_id}`;
