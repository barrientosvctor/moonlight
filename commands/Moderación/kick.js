let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'kick',
    description: 'Expulsa a un miembro del servidor.',
    cooldown: 3,
    aliases: ['expulsar'],
    category: 'Moderación',
    usage: '<@miembro | ID> [motivo]',
    example: '@NeonDark#0001',
    enabled: true,
    botPerms: ['KickMembers'],
    memberPerms: ['KickMembers'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro que vas a expulsar.`);

            /** @type {discord.GuildMember} */
            const member = getMember(args[1]);
            let motivo = args.slice(2).join(' '),
            embed = new discord.EmbedBuilder();

            if(!member) return msg.channel.send(`${bot.getEmoji('error')} Parece que este usuario no pertenece al servidor.`);
            if(!motivo) motivo = 'No se dio motivo.';
            if(motivo.length >= 511) motivo = motivo.slice(0, 508) + '...';

            if(member === msg.member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes expulsarte a ti mismo!`);
            if(member === msg.guild.me) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes expulsarme con mis comandos.`);
            if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes expulsar a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al tuyo.`);
            //if(member.roles.highest.position >= msg.guild.me.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedo expulsar a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al mío.`);
            if(!member.manageable) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedo expulsar a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al mío.`);
            if(!member.kickable) return msg.channel.send(`${bot.getEmoji('error')} No se puede expulsar a este miembro.`);

            await member.kick(motivo).then(async () => {
                msg.reply(`> ${bot.getEmoji('check')} Se expulsó correctamente del servidor a **${member.user.tag}**`);
                try {
                    await member.user.send(`> ¡Has sido expulsado de **${msg.guild.name}** por el usuario **${msg.author.tag}**!\n**Motivo:** ${motivo}`);
                } catch (error) {
                    msg.channel.send(`No fue posible enviarle un mensaje privado avisándole sobre su baneo, tal vez se deba a que tiene cerrado los mensajes privados.`);
                }
            }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar expulsar al miembro:\n\`${error}\``));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
