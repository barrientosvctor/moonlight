let Command = require('../../base/models/Command'),
discord = require('discord.js'),
database = require('../../base/packages/database'),
ms = require('../../base/packages/ms'),
humanize = require('../../base/packages/humanize');
module.exports = new Command({
    name: 'tempmute',
    description: 'Mutea temporalmente a un miembro del servidor',
    cooldown: 3,
    category: 'Moderación',
    usage: '<@miembro | ID> <tiempo> [motivo]',
    example: '@Coss#0001 1h Algún motivo',
    enabled: true,
    botPerms: ['MANAGE_ROLES'],
    memberPerms: ['MANAGE_ROLES'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            let db = new database('./databases/muterole.json');
            if(db.has(msg.guildId)) {
                if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro que vas a mutear.`);
            
                /** @type {discord.GuildMember} */
                let member = getMember(args[1]),
                embed = new discord.MessageEmbed();
                if(!member) return msg.channel.send(`**${msg.author.username}**, parece que ese usuario no pertenece al servidor.`);
                if(!args[2] || args[2] !== (`${parseInt(args[2].slice(0))}s`) && args[2] !== (`${parseInt(args[2].slice(0))}m`) && args[2] !== (`${parseInt(args[2].slice(0))}h`) && args[2] !== (`${parseInt(args[2].slice(0))}d`) && args[2] !== (`${parseInt(args[2].slice(0))}w`) && args[2] !== (`${parseInt(args[2].slice(0))}y`)) return msg.channel.send(`**${msg.author.username}** escribe una duración válida. (10s/5m/1h/2w/1y)`);
                if(args[2].slice(0) >= 1 || args[2].slice(0) <= 50 && args[2].endsWith('s')) return msg.channel.send(`${bot.getEmoji('error')} No puedes poner un tiempo tan corto.`);
                let motivo = args.slice(3).join(' ');
                if(!motivo) motivo = 'No se dio motivo.';
                if(motivo.length >= 511) motivo = motivo.slice(0, 508) + '...';

                if(member === msg.member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no te puedes mutear a ti mismo.`);
                if(member === msg.guild.me) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no me puedes mutear del servidor con mis comandos.`);

                if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No puedo mutear a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al tuyo.`);
                //if(member.roles.highest.position >= msg.guild.me.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No logré mutear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
                if(!member.manageable) return msg.channel.send(`${bot.getEmoji('error')} No logré mutear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
                if(member.roles.cache.has(await db.get(msg.guildId))) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ${member.user.tag} ya estaba muteado.`);

                await member.roles.add(await db.get(msg.guildId)).then(async () => {
                    let duration = humanize(ms(args[2]));
                    msg.reply(`> ${bot.getEmoji('check')} **${member.user.tag}** (\`${member.user.id}\`) ha sido muteado por **${duration}**`);
                    try {
                        await member.user.send(`> ¡Has sido muteado temporalmente de **${msg.guild.name}** por **${msg.author.tag}**!\n**Duración:** ${duration}\n**Motivo:** ${motivo}`);
                    } catch (error) {
                        msg.channel.send(`No fue posible enviarle un mensaje privado avisándole sobre su baneo, tal vez se deba a que tiene cerrado los mensajes privados.`);
                    }
                    setTimeout(async () => {
                        await member.roles.remove(await db.get(msg.guildId)).catch(error => {});
                        try {
                            await member.user.send(`> ${bot.getEmoji('party')} ¡Tu muteo temporal de **${msg.guild.name}** ha terminado!`);
                        } catch (error) {
                            await member.user.send(`> ${bot.getEmoji('error')} Tu mute temporal ha terminado pero no fui capaz de quitarte el rol debido a una falta de permisos en el servidor, contacta a los staffs sobre esto.`);
                        }
                    }, ms(args[2]));
                }).catch(error => msg.channel.send(`> ${bot.getEmoji('warning')} Ocurrió un error al intentar mutear al miembro:\n\`${error}\``))
            } else return msg.channel.send(`${bot.getEmoji('error')} Todavía no puedes mutear a nadie en este momento debido a que no has configurado un rol para mutear en el servidor. Para ello haz uso del comando \`${prefix}muterole set\`.`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});