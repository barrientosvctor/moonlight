let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'smile',
    description: 'Sonriele a una persona del servidor.',
    cooldown: 3,
    aliases: ['sonrisa', 'sonreir'],
    category: 'Interacción',
    usage: '[@usuario | ID]',
    example: '@Doktor#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            let data = await fetch(`https://kawaii.red/api/gif/smile/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setImage(data.response);
            embed.setColor('RANDOM');
            if(!args[1]) {
                embed.setDescription(`¡**${msg.author.username}** le sonrie a todos!`);
            } else {
                /** @type {discord.GuildMember} */
                let member = getMember(args[1]);
                if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
                if(member.user.id === msg.author.id) embed.setDescription(`**${msg.author.username}** se está sonriendo a si mismo!`);
                else embed.setDescription(`¡**${msg.author.username}** le está sonriendo a **${member.user.username}**!`);
            }
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});