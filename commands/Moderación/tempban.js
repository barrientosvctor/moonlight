let Command = require('../../base/models/Command'),
discord = require('discord.js'),
ms = require('../../base/packages/ms'),
humanize = require('../../base/packages/humanize');
module.exports = new Command({
    name: 'tempban',
    description: 'Banea temporalmente a un miembro del servidor.',
    cooldown: 3,
    category: 'Moderación',
    usage: '<@miembro | ID> <tiempo> [motivo]',
    example: '@Mina#0001 1h',
    enabled: true,
    botPerms: ['BAN_MEMBERS'],
    memberPerms: ['BAN_MEMBERS'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro que vayas a banear.`);
            
            /** @type {discord.GuildMember} */
            let member = getMember(args[1]),
            embed = new discord.MessageEmbed();
            if(!member) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese usuario no pertenece a este servidor.`);
            if(!args[2] || args[2] !== (`${parseInt(args[2].slice(0))}s`) && args[2] !== (`${parseInt(args[2].slice(0))}m`) && args[2] !== (`${parseInt(args[2].slice(0))}h`) && args[2] !== (`${parseInt(args[2].slice(0))}d`) && args[2] !== (`${parseInt(args[2].slice(0))}w`) && args[2] !== (`${parseInt(args[2].slice(0))}y`)) return msg.channel.send(`**${msg.author.username}** escribe una duración válida. (10s/5m/1h/2w/1y)`);
            if(args[2].split('s')[0] >= 1 || args[2].split('s')[0] <= 9 && args[2].endsWith('s')) return msg.channel.send(`${bot.getEmoji('error')} No puedes poner un tiempo tan corto.`);

            let motivo = args.slice(3).join(' ');
            if(!motivo) motivo = 'No se dio motivo.';
            if(motivo.length >= 511) motivo = motivo.slice(0, 508) + '...';

            if(member === msg.member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no te puedes banear a ti mismo.`);
            if(member === msg.guild.me) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no me puedes banear del servidor con mis comandos.`);
            if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No puedo banear a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al tuyo.`);
            //if(member.roles.highest.position >= msg.guild.me.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} Me resulta imposible banear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
            if(!member.manageable) return msg.channel.send(`${bot.getEmoji('error')} Me resulta imposible banear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
            if(!member.bannable) return msg.channel.send(`${bot.getEmoji('error')} A este miembro no es posible banearle`);

            await member.ban({ reason: motivo }).then(async () => {
                let duration = humanize(ms(args[2]));
                msg.reply(`> ${bot.getEmoji('check')} **${member.user.tag}** (\`${member.user.id}\`) ha sido baneado temporalmente por **${duration}**`);
                try {
                    await member.user.send(`> ¡Has sido baneado temporalmente de **${msg.guild.name}** por **${msg.author.username}**!\n**Duración:** ${duration}\n**Motivo:** ${motivo}`);
                } catch (error) {
                    msg.channel.send(`No fue posible enviarle un mensaje privado avisándole sobre su baneo, tal vez se deba a que tiene cerrado los mensajes privados.`);
                }
                setTimeout(async () => {
                    await msg.guild.members.unban(member.user.id).then(async () => {
                        try {
                            await member.user.send(`> ¡Acabas de ser desbaneado de **${msg.guild.name}**!`)
                        } catch (error) {
                            msg.channel.send(`**${member.user.tag}** no pudo ser desbaneado debido a un error desconocido.`);
                        }
                    }).catch(error => {});
                }, ms(args[2]));
            }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar banear temporalmente al miembro:\n\`${error}\``));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});