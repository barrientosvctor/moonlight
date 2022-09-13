let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'confused',
    description: 'Estás muy confundido.',
    cooldown: 3,
    aliases: ['confundido'],
    category: 'Interacción',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            let data = await fetch(`https://kawaii.red/api/gif/confused/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setDescription(`**${msg.author.username}** está muy confundido.`)
            embed.setColor('RANDOM')
            embed.setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error desconocido al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
