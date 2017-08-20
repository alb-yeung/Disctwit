const Discord = require('discord.js');
const client = new Discord.Client();
const token = require('./key.json');


client.on('ready', () => {
    console.log('I am ready in '+'!');
});

client.on('message', message => {
    if (message.content === 'ping') {
	message.reply('pong');
    }
});

client.login(token.discord);
