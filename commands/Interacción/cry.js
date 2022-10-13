let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'cry',
    description: 'Llora todo lo que tengas que llorar.',
    cooldown: 3,
    aliases: ['llorar'],
    category: 'Interacción',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            const data = await fetch(`https://kawaii.red/api/gif/cry/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json());
            const embed = new discord.EmbedBuilder()
            .setColor('Random')
            .setDescription(`**${msg.author.username}** empezó a llorar.`)
            .setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
