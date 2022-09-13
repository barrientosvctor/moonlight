let Command = require('../../base/models/Command'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Command({
    name: 'mute',
    description: 'Mutea a un miembro del servidor para siempre hasta que le sea quitado el mute por otra persona.',
    cooldown: 3,
    category: 'Moderación',
    usage: '<@miembro | ID> [motivo]',
    example: '@Windor#0001',
    enabled: true,
    botPerms: ['MANAGE_ROLES'],
    memberPerms: ['MANAGE_ROLES'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            let db = new database('./databases/muterole.json');
            // Verifica si hay un rol mute configurado en el servidor.
            if(db.has(msg.guildId)) {
                if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro a mutear.`);

                /** @type {discord.GuildMember} */
                let member = getMember(args[1]),
                motivo = args.slice(2).join(' '),
                embed = new discord.MessageEmbed();
                if(!member) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese usuario no pertenece al servidor.`);
                if(!motivo) motivo = 'No se dio motivo.';
                if(motivo.length >= 511) motivo = motivo.slice(0, 508) + '...';

                if(member === msg.member) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no te puedes mutear a ti mismo.`);
                if(member === msg.guild.me) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no me puedes mutear del servidor con mis comandos.`);

                if(member.roles.highest.position >= msg.member.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No puedo mutear a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al tuyo.`);
                //if(member.roles.highest.position >= msg.guild.me.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No logré mutear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
                if(!member.manageable) return msg.channel.send(`${bot.getEmoji('error')} No logré mutear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`);
                if(member.roles.cache.has(await db.get(msg.guildId))) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ${member.user.tag} ya estaba muteado.`);

                await member.roles.add(await db.get(msg.guildId), motivo).then(async () => {
                    msg.reply(`> ${bot.getEmoji('check')} **${member.user.tag}** (\`${member.user.id}\`) ha sido silenciado del servidor.`);
                    try {
                        await member.user.send(`> ¡Acabas de ser muteado en **${msg.guild.name}** por **${msg.author.tag}**!\n**Motivo:** ${motivo}`);
                    } catch (error) {
                        msg.channel.send('No fue posible enviarle un mensaje privado avisándole sobre su baneo, tal vez se deba a que tiene cerrado los mensajes privados.');
                    }
                }).catch(error => msg.channel.send(`> ${bot.getEmoji('warning')} Ocurrió un error al intentar mutear al miembro:\n\`${error}\``));
            } else return msg.channel.send(`${bot.getEmoji('error')} Todavía no puedes mutear a nadie en este momento debido a que no has configurado un rol para mutear en el servidor. Para ello haz uso del comando \`${prefix}muterole set\`.`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});