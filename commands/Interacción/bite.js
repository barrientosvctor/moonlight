let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'bite',
    description: 'Muerde a un miembro.',
    cooldown: 3,
    aliases: ['morder'],
    category: 'Interacción',
    usage: '<@usuario | ID>',
    example: '@Darkest#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona a una persona para morderla.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[1]);
            if(!member) return msg.channel.send(`${bot.getEmoji('error')} no pude encontrar a esa persona en el servidor.`);
            if(member.user.id === msg.author.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ¿por qué te morderías a ti mismo?`);
            if(member.user.id === bot.user.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ¡No me gusta que me muerdan, prueba con otro!`);
            let data = await fetch(`https://kawaii.red/api/gif/bite/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setDescription(`**${msg.author.username}** mordió a **${member.user.username}**.`)
            embed.setColor('RANDOM')
            embed.setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error desconocido al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
