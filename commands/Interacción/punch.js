let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'punch',
    description: 'Golpea a una persona del servidor.',
    cooldown: 3,
    aliases: ['golpear', 'golpe'],
    category: 'Interacción',
    usage: '<@miembro | ID>',
    example: '@Darkest#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, debes mencionar a la persona que vas a golpear.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[1]),
            data = await fetch(`https://kawaii.red/api/gif/punch/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member.user.id === msg.author.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ¿te harías daño a ti mismo? ¿estás loco?`);
            if(member.user.id === bot.user.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ¿por qué me harías daño?`);
            embed.setDescription(`**${msg.author.username}** golpeó a **${member.user.username}**.`)
            embed.setColor('RANDOM')
            embed.setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});