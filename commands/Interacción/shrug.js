let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'shrug',
    description: '¯\\_(ツ)_/¯',
    cooldown: 3,
    category: 'Interacción',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            let data = await fetch(`https://kawaii.red/api/gif/shrug/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setColor('RANDOM')
            embed.setImage(data.response);
            embed.setDescription(`**¯\\_(ツ)_/¯**`);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});