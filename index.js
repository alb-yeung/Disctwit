const Discord = require('discord.js');
const TwitterStream = require('user-stream');
const client = new Discord.Client();
const token = require('./key.json');
var following = token.following;
var followingNames = token.followingNames;
var TwitterRest = require('twitter-node-client').Twitter;
const stream = new TwitterStream({
    consumer_key : token.consumerkey,
    consumer_secret : token.consumersecret,
    access_token_key : token.accesskey,
    access_token_secret : token.accesssecret
});
var twitter = new TwitterRest({
    "consumerKey" : token.consumerkey,
    "consumerSecret" : token.consumersecret,
    "accessToken": token.accesskey,
    "accessTokenSecret" : token.accesssecret
});
var channel;
client.on('ready', () => {
    console.log('I am loaded!!!')
});

client.on('message', message => {
    if (message.content === 'ping') {
	if (message.channel.id == token.channel) message.reply('pong');
	else message.reply('wrong channel');
    }
    if (message.content.startsWith("!")) {
	var command = message.content.substr(1);
	if (command.startsWith("follow ")) {
	    command = command.substr(7);
	    twitter.getUser({screen_name : command}, errorUser, successUser);
	}
	if (command.startsWith("loadHere")){
	    channel = message.channel;
	    message.reply("loaded in this channel!!");
	}
	if (command.startsWith("save"))
	    token.following = following;
	if (command.startsWith("following"))
	    channel.send(followingNames);
    }
});

//Twitter get account rest error and success
var errorUser = function (err, response, body) {
    console.log('ERROR [%s]', err);
    channel.send('Twitter user not found');
    return 0;
};
var successUser = function (data) {
    console.log('Success');
    user=JSON.parse(data);
    following.push(user.id);
    followingNames.push(user.screen_name);
    channel.send(user.screen_name + " successfully followed");
    channel.send("Following list now ```" + followingNames + "```");
};

stream.on('data', json => {
    //console.log(json);
    if (following.includes(json.user.id)){
		channel.send(json.user.screen_name + " tweeted ```" + json.text + "```");// + "https://twitter.com/" + json.user.screen_name + "/status/" + json.id_str);
    }
});

client.login(token.discord);
stream.stream();
