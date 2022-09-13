let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'laugh',
    description: 'Riete de una persona del servidor.',
    cooldown: 3,
    aliases: ['reir', 'risa'],
    category: 'Interacción',
    usage: '<@miembro | ID>',
    example: '@Leo#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona a la persona de la que te quieres reir.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[1]),
            data = await fetch(`https://kawaii.red/api/gif/laugh/token=${process.env.kawaii_api_key}/`, { method: 'GET' }).then(res => res.json()),
            embed = new discord.MessageEmbed();
            if(!member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no pude encontrar a esa persona en el servidor.`);
            if(member.user.id === msg.author.id) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes reirte a ti mismo, parecerías psicópata.`);
            embed.setDescription(`¡**${msg.author.username}** se está riendo de **${member.user.username}**!`)
            embed.setColor('RANDOM')
            embed.setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});