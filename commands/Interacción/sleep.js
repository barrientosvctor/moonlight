let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'sleep',
    description: 'A dormir se ha dicho.',
    cooldown: 3,
    aliases: ['dormir'],
    category: 'Interacción',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            let data = await fetch(`https://kawaii.red/api/gif/sleepy/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setColor('RANDOM')
            embed.setDescription(`**${msg.author.username}** se fue a dormir.`)
            embed.setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});