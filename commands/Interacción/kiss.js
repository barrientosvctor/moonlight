let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'kiss',
    description: 'Besa a la persona que quieras.',
    cooldown: 3,
    aliases: ['besar'],
    category: 'Interacción',
    usage: '<@usuario | ID>',
    example: '@Darkest#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona a la persona que quieras besar.`);

            /** @type {discord.GuildMember} */
            const member = getMember(args[1]) || msg.guild.members.cache.get(args[1]);
            const data = await fetch(`https://nekos.life/api/v2/img/kiss`, { method: 'GET' }).then(res => res.json());
            let embed = new discord.EmbedBuilder();

            if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member.user.id === msg.author.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes besarte a ti mismo, eso sería muy raro jeje.`);

            embed.setColor('Random')
            embed.setDescription(`**${msg.author.username}** le dio un beso a **${member.user.username}**.`)
            embed.setImage(data.url);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
