let Command = require('../../base/models/Command'),
discord = require('discord.js'),
shortener = require('isgd'),
http_validation = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
module.exports = new Command({
    name: 'shortlink',
    description: 'Acortador de URL.',
    cooldown: 3,
    aliases: ['shorten', 'shorturl', 'url', 'urlshort', 'shortener'],
    category: 'Utilidades',
    usage: '<url> [tag]',
    example: 'https://google.com iridescent',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una URL para acortar.`);
            if(!http_validation.test(args[1])) return msg.channel.send(`${bot.getEmoji('error')} La URL que proporcionaste no es válida, asegurate de escribirlo bien o intentalo de nuevo más tarde.`);
            else {
                if(bot.bl_url.some(url => args[1].toLowerCase().includes(url)) || bot.nsfw_url.some(url => args[1].toLowerCase().includes(url))) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, la URL que escribiste está en la lista negra del bot.`);
                if(!args[2]) {
                    shortener.shorten(args[1], res => {
                        if(res === 'Error: The shortened URL you picked already exists, please choose another.') return msg.channel.send(`${bot.getEmoji('error')} La URL ya existe, prueba con otra.`);
                        return msg.reply(`> ${bot.getEmoji('check')} URL acortada correctamente: <${res}>`);
                    });
                } else {
                    shortener.custom(args[1], args[2], res => {
                        if(res === 'Error: The shortened URL you picked already exists, please choose another.') return msg.channel.send(`${bot.getEmoji('error')} La URL ya existe, prueba con otra.`);
                        if(res === 'Error: Short URLs must be at least 5 characters long') return msg.channel.send(`${bot.getEmoji('error')} La etiqueta debe tener mínimo 5 carácteres o más.`);
                        return msg.reply(`> ${bot.getEmoji('check')} URL acortada correctamente con la etiqueta: <${res}>`);
                    });
                }
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
