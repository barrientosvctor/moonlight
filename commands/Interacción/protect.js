let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'protect',
    description: 'Protege a una persona del servidor de otra persona.',
    cooldown: 3,
    aliases: ['proteger'],
    category: 'Interacción',
    usage: '<@miembro | ID> <@miembro | ID>',
    example: '@Doktor#0001 @Neast#0002',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, debes mencionar a que usuario proteger.`);

            /** @type {discord.GuildMember} */
            const member1 = getMember(args[1]);
            if(!member1) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member1.user.id === bot.user.id) return msg.channel.send(`**${msg.author.username}**, no puedes protegerme de nadie.`);
            if(member1.user.id === msg.member.user.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes protegerte de ti mismo.`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, debes mencionar de quién quieres proteger a ${member1.user.username}.`);

            /** @type {discord.GuildMember} */
            const member2 = getMember(args[2]);
            if(!member2) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member2.user.id === msg.author.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes protegerte de ti mismo.`);
            if(member2.user.id === bot.user.id) return msg.channel.send(`**${msg.author.username}**, ¿yo qué he hecho?`);
            if(member1.user.id === member2.user.id) return msg.channel.send(`**${msg.author.username}**, ¿qué sentido tiene eso?`);

            const data = await fetch(`https://kawaii.red/api/gif/protect/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json());
            const embed = new discord.EmbedBuilder()
            embed.setDescription(`**${msg.author.username}** está protegiendo a **${member1.user.username}** de **${member2.user.username}**.`)
            embed.setImage(data.response)
            embed.setColor('Random');
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
