let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'facepalm',
    description: 'Decepcionate de una persona del servidor.',
    cooldown: 3,
    aliases: ['decepcionado'],
    category: 'Interacción',
    usage: '[@miembro | ID]',
    example: '@Karina#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            const data = await fetch(`https://kawaii.red/api/gif/facepalm/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json());
            let embed = new discord.EmbedBuilder();
            embed.setColor('Random')
            embed.setImage(data.response)
            if(!args[1]) embed.setDescription(`**${msg.author.username}** se decepcionó de si mismo.`);
            else {
                /** @type {discord.GuildMember} */
                const member = getMember(args[1]);
                if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
                embed.setDescription(`**${msg.author.username}** se decepcionó de **${member.user.username}**.`);
            }
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
