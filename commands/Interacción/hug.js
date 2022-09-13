let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'hug',
    description: 'Abraza a la persona que quieras.',
    cooldown: 3,
    aliases: ['abrazar', 'abrazo'],
    category: 'Interacción',
    usage: '<@usuario | ID>',
    example: '@Darkest#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona a la persona que quieras abrazar.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[1]),
            data = await fetch(`https://nekos.life/api/v2/img/hug`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();

            if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member.user.id === msg.author.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes abrazarte a ti mismo, eso sería muy raro jeje.`);
            
            embed.setColor('RANDOM')
            embed.setDescription(`**${msg.author.username}** le dio un fuerte abrazo a **${member.user.username}**.`)
            embed.setImage(data.url);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
