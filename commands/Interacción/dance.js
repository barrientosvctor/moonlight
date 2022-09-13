let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'dance',
    description: 'Baila con una persona del servidor.',
    cooldown: 3,
    aliases: ['bailar', 'bailando'],
    category: 'Interacción',
    usage: '<@miembro | ID>',
    example: '@Asuna#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona a una persona del servidor para bailar con él.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[1]),
            data = await fetch(`https://kawaii.red/api/gif/dance/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            
            if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member.user.id === msg.author.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes bailar con ti mismo, eso sería raro jeje.`);

            embed.setDescription(`**${msg.author.username}** está bailando con **${member.user.username}**.`)
            embed.setColor('RANDOM')
            embed.setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});