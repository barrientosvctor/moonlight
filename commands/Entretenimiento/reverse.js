let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'reverse',
    description: 'Pon en reversa un texto.',
    cooldown: 3,
    aliases: ['reversa'],
    category: 'Entretenimiento',
    usage: '<texto>',
    example: 'Heyo',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el texto que quieres hacerlo reversa.`);
            return msg.reply(`${args.slice(1).join(' ').split('').reverse().join('')}`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});