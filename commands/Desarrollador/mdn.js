let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'mdn',
    description: 'Obtiene resultados de la documentación de Mozilla Developer Network.',
    cooldown: 3,
    category: 'Desarrollador',
    usage: '<busqueda>',
    example: 'console',
    ownerOnly: true,
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, debes escribir algo para buscar.`);
            const data = await fetch(`https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(args.slice(1).join(' '))}&locale=es`, { method: 'GET' }).then(res => res.json());
            return msg.reply(`> __${data.documents[0].title}__\n${data.documents[0].summary}\nFuente: <https://developer.mozilla.org${data.documents[0].mdn_url}>`);
        } catch (err) {
            return bot.err(`Hubo un error al buscar la documentación de MDN`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
