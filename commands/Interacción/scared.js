let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'scared',
    description: 'Estás asustao.',
    cooldown: 3,
    aliases: ['asustado'],
    category: 'Interacción',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            const data = await fetch(`https://kawaii.red/api/gif/scared/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json());
            const embed = new discord.EmbedBuilder()
            .setColor('Random')
            .setImage(data.response)
            .setDescription(`**${msg.author.username}** se siente asustado.`);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
