let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'morse',
    description: 'Convierte un texto a código morse.',
    cooldown: 3,
    category: 'Utilidades',
    usage: '<texto>',
    example: 'Hola',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el texto que vas a convertir en código morse.`);

            const data = await fetch(`https://api.popcat.xyz/texttomorse?text=${args.slice(1).join(' ').replace(' ', '%20')}`, { method: 'GET' }).then(res => res.json());
            if(data.error) return msg.channel.send(`${bot.getEmoji('error')} Hubo un error externo al intentar convertir el texto.`);

            return msg.reply(`${data.morse}`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
