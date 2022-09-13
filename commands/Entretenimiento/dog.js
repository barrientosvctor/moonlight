let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'dog',
    description: 'Muestra la foto de un perro.',
    cooldown: 3,
    aliases: ['perro'],
    category: 'Entretenimiento',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            let data = await fetch('https://api.thedogapi.com/v1/images/search').then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setColor('RANDOM')
            embed.setDescription('¡Mira a este lindo perro! :dog:')
            embed.setImage(data[0].url);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar obtener la imagen.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});