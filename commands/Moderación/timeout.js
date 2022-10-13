let Command = require('../../base/models/Command'),

discord = require('discord.js'),
ms = require('../../base/packages/ms'),
humanize = require('../../base/packages/humanize');
module.exports = new Command({
    name: 'timeout',
    description: 'Aisla temporalmente a un miembro del servidor.',
    cooldown: 3,
    aliases: ['aislar'],
    category: 'Moderación',
    usage: '<@miembro | ID> <tiempo> [motivo]',
    example: '@Fernando#0001',
    enabled: false,
    botPerms: ['ModerateMembers'],
    memberPerms: ['ModerateMembers'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro que vas a aislar del servidor.`);

            /** @type {discord.GuildMember} */
            const member = getMember(args[1]);
            const time = args[2];
            let motivo = args.slice(3).join(' '),
            embed = new discord.EmbedBuilder();

            if(!member) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese usuario no pertenece al servidor.`);
	    if(!motivo) motivo = 'No especificado.'
            if(!time) return msg.channel.send(`${bot.getEmoji('error')} Escribe un tiempo válido.`);
	    if (member === msg.guild.members.me) return msg.channel.send(`${bot.getEmoji('error')} No puedes aislarme con mis propios comandos.`);

            await member.timeout(ms(time), motivo).then(() => {
                return msg.reply(`> ${bot.getEmoji('check')} **${member.user.tag}** ha sido aislado del servidor por ${humanize(ms(time))}.`);
            }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar aislar al miembro:\n\`${error}\``));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
