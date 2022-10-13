let Command = require('../../base/models/Command'),
discord = require('discord.js'),
http_validation = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
module.exports = new Command({
    name: 'qrcode',
    description: 'Genera un código QR con la URL que incluyas en el mensaje.',
    cooldown: 3,
    aliases: ['qr'],
    category: 'Utilidades',
    usage: '<URL>',
    example: 'https://google.com/',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe la URL que contendrá el código QR.`);
            if(!http_validation.test(args[1])) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, tu URL es inválida, asegurate de que empiece con el protocolo HTTP o intenta de nuevo más tarde.`);
            else {
                if(bot.bl_url.some(url => args[1].toLowerCase().includes(url))) return msg.channel.send(`${bot.getEmoji('error')} Ese dominio está en la lista negra del bot.`);
                if(bot.nsfw_url.some(url => args[1].toLowerCase().includes(url)) && !msg.channel.nsfw) return msg.channel.send(`${bot.getEmoji('error')} Para hacer esto debes de ejecutar el comando en un canal marcado cómo NSFW.`);
                const embed = new discord.EmbedBuilder()
                .setTitle('Código QR generado éxitosamente')
                .setDescription(`URL: ${args[1]}`)
                .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${args[1]}`)
                .setColor('Random');
                return msg.reply({ embeds: [embed] });
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
