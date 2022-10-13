let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'fox',
    description: 'Muestra la foto de un zorro.',
    cooldown: 3,
    aliases: ['zorro'],
    category: 'Entretenimiento',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            const data = await fetch('https://randomfox.ca/floof/', { method: 'GET' }).then(res => res.json());
            const embed = new discord.EmbedBuilder()
            embed.setColor('Random')
            embed.setDescription(`Mira este lindo zorro. :fox:`)
            embed.setImage(data.image);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
