let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'binary',
    description: 'Encripta o desencripta textos a código binario.',
    cooldown: 3,
    aliases: ['binario'],
    category: 'Utilidades',
    usage: '<decode / encode> <texto>',
    example: 'encode Hola mundo',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`encode\`: Encripta un texto a código binario.\n\`decode\`: Desencripta código binario a texto.`);
            if(!['decode', 'encode'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida!`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el texto o código que vas a encriptar o desencriptar.`);
            if(args.slice(2).join(' ').length > 1000) return msg.channel.send(`${bot.getEmoji('error')} El texto no puede tener más de 1,000 carácteres. Tu texto contiene **${args.slice(2).join(' ').length}** carácteres.`);
            let data;

            if(args[1] === 'encode') {
                data = await fetch(`https://some-random-api.ml/binary?text=${encodeURIComponent(args.slice(2).join(' '))}`).then(res => res.json());
                return msg.reply(`${data.binary}`);
            } else {
                data = await fetch(`https://some-random-api.ml/binary?decode=${encodeURIComponent(args[2])}`).then(res => res.json());
                return msg.reply(`${data.text}`);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});