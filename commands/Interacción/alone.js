let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'alone',
    description: 'Te sientes muy solo...',
    cooldown: 3,
    aliases: ['lonely', 'solo', 'solitario', 'soledad'],
    category: 'Interacción',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            const data = await fetch(`https://kawaii.red/api/gif/lonely/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json());
            const embed = new discord.EmbedBuilder()
            .setDescription(`**${msg.author.username}** se siente solo...`)
            .setColor('DarkGrey')
            .setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
