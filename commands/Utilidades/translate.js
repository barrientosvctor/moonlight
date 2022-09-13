let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'translate',
    description: 'Traduce un texto al idioma que quieras. Revisa los códigos de los idiomas [haciendo click aquí](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)',
    cooldown: 3,
    aliases: ['traductor', 'traducir'],
    category: 'Utilidades',
    usage: '<código idioma a traducir> <texto>',
    example: 'en Hola',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el código de idioma que quieres traducir el texto.\nPara conocer los códigos de idioma disponibles haz click en la siguiente URL: <https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>`);
            if(!bot.utils.translate[args[1]]) return msg.channel.send(`${bot.getEmoji('error')} Ese código de idioma no es válido!\nPara conocer los códigos de idioma disponibles haz click en la siguiente URL: <https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el texto que vas a traducir al idioma ${bot.utils.translate[args[1]]}.`);

            let data = await fetch(`https://api.popcat.xyz/translate?to=${args[1]}&text=${args.slice(2).join(' ')}`).then(res => res.json());
            return msg.reply(`> Traducción al ${bot.utils.translate[args[1]]}: ${data.translated}`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});