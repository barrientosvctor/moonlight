let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'vaporwave',
    description: 'Convierte un texto a un estilo ｖ ａ ｐ ｏ ｒ ｗ ａ ｖ ｅ.',
    cooldown: 3,
    category: 'Entretenimiento',
    usage: '<texto>',
    example: 'Hola',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe un texto para convertir.`);
            const vaporwavefity = args.slice(1).join(' ').split('').map(char => {
                const code = char.charCodeAt(0);
                return code >= 33 && code <= 126 ? String.fromCharCode((code - 33) + 65281) : char
            }).join(' ');
            return msg.reply(`${vaporwavefity.toString()}`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
