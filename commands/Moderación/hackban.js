let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'hackban',
    description: 'Banea y elimina los mensajes de la última semana de un miembro del servidor',
    cooldown: 3,
    category: 'Moderación',
    usage: '<@miembro | ID> [motivo]',
    example: '@Vernon#0001',
    enabled: true,
    botPerms: ['BAN_MEMBERS', 'MANAGE_MESSAGES'],
    memberPerms: ['BAN_MEMBERS'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro que vayas a banear.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[1]),
            motivo = args.slice(2).join(' '),
            embed = new discord.MessageEmbed();
            if(!member) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese usuario no pertenece al servidor.`);
            if(!motivo) motivo = 'No se dio motivo.';
            if(motivo.length >= 511) motivo = motivo.slice(0, 508) + '...';

            if(member === msg.member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no te puedes banear a ti mismo.`);
            if(member === msg.guild.me) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no me puedes banear del servidor con mis comandos.`);
            if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No puedo banear a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al tuyo.`);
            //if(member.roles.highest.position >= msg.guild.me.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} Se me hizo dificil banear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
            if(!member.manageable) return msg.channel.send(`${bot.getEmoji('error')} Se me hizo dificil banear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
            if(!member.bannable) return msg.channel.send(`${bot.getEmoji('error')} A este miembro no es posible banearle`);

            await member.ban({ reason: motivo, days: 7 }).then(async () => {
                msg.reply(`> ${bot.getEmoji('check')} **${member.user.tag}** ha sido baneado del servidor éxitosamente.`);
                try {
                    await member.user.send(`> ¡Has sido baneado de **${msg.guild.name}** por **${msg.author.tag}**!\n**Motivo:** ${motivo}`);
                } catch (error) {
                    msg.channel.send(`No fue posible enviarle un mensaje privado avisándole sobre su baneo, tal vez se deba a que tiene cerrado los mensajes privados.`);
                }
            }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error mientras se intentaba banear al miembro:\n\`${error}\``));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});