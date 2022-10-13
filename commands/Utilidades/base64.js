let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'base64',
    description: 'Encriptaciones o desencriptaciones basadas en 64 bits.',
    cooldown: 3,
    aliases: ['64bits'],
    category: 'Utilidades',
    usage: '<decode | encode> <texto>',
    example: 'encode Hola mundo',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`encode\`: Encripta un texto a lenguaje basado en 84 bits.\n\`decode\`: Desencripta lenguaje de 64 bits a texto normal.`);
            if(!['decode', 'encode'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida!`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el texto o código que vas a encriptar o desencriptar.`);
            if(args.slice(2).join(' ').length > 500) return msg.channel.send(`${bot.getEmoji('error')} El texto no puede tener más de 500 carácteres. Tu texto contiene **${args.slice(2).join(' ').length}** carácteres.`);

            let data;
            if(args[1] === 'encode') {
                data = await fetch(`https://some-random-api.ml/base64?encode=${encodeURIComponent(args.slice(2).join(' '))}`, { method: 'GET' }).then(res => res.json());
                return msg.reply(`${data.base64}`);
            } else {
                data = await fetch(`https://some-random-api.ml/base64?decode=${encodeURIComponent(args[2])}`, { method: 'GET' }).then(res => res.json());
                return msg.reply(`${data.text}`);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
