let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'pat',
    description: 'Dale una palmadita a una persona del servidor.',
    cooldown: 3,
    aliases: ['palmadita'],
    category: 'Interacción',
    usage: '<@miembro | ID>',
    example: '@Neon#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona a la persona que quieras darle una palmadita.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[1]),
            data = await fetch(`https://nekos.life/api/v2/img/pat`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();

            if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member.user.id === msg.author.id) embed.setDescription(`**${msg.author.username}** se dio una palmadita a si mismo.`);
            else embed.setDescription(`**${msg.author.username}** le dio una palmadita a **${member.user.username}**.`)
            embed.setColor('RANDOM')
            embed.setImage(data.url);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});