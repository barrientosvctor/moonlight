let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'role',
    description: 'Añade o elimina un rol a un miembro del servidor.',
    cooldown: 3,
    aliases: ['rol'],
    category: 'Moderación',
    usage: '<add / remove / delete> <@miembro | ID> <@rol | ID>',
    example: 'add @Karn#0001 @Moderador',
    enabled: true,
    botPerms: ['ManageRoles'],
    memberPerms: ['ManageRoles'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`add\`: Añade a un miembro el rol mencionado.\n\`remove\`: Le quita el rol mencionado a un miembro.`);
            if(!['add', 'remove'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida.`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID de un miembro del servidor.`);

            /** @type {discord.GuildMember} */
            const member = getMember(args[2]);
            if(!member) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese usuario no pertenece al servidor.`);
            
            if(!args[3]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del rol.`);

            /** @type {discord.Role} */
            const role = getRole(args[3]);
            let embed = new discord.EmbedBuilder();
            if(!role) return msg.channel.send(`${bot.getEmoji('error')} Ese rol no existe en el servidor.`);

            if(args[1] === 'add') {
                if(!args[3]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del rol que vas a añadirle a ${member.user.tag}`);
                if(role.position >= msg.member.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No puedes otorgar ese rol debido a que jerárquicamente es igual o superior al tuyo.`);
                if(role.position >= msg.guild.members.me.roles.highest.position) return msg.channel.send(`No puedo añadir ese rol debido a que jerárquicamente igual o superior al mío.`);
                if(role.managed) return msg.channel.send(`${bot.getEmoji('error')} No puedes otorgar un rol que está gestionado.`);
                if(member.roles.cache.has(role.id)) return msg.reply(`> **${member.user.tag}** ya tenía ese rol.`);

                await member.roles.add(role.id).then(() => {
                    return msg.reply(`> ${bot.getEmoji('check')} Se le ha otorgado correctamente el rol **${role.name}** al miembro **${member.user.tag}**.`);
                }).catch(error => msg.channel.send(`${bot.getEmoji('error')} Ocurrió un error al intentar añadir el rol:\n\`${error}\``));
            } else if(args[1] === 'remove') {
                if(!args[3]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del rol que vas a quitarle a ${member.user.tag}`);
                if(role.position >= msg.member.roles.highest.position) return msg.channel.send(`${bot.getEmoji('error')} No puedes quitar ese rol debido a que jerárquicamente es igual o superior al tuyo.`);
                if(role.position >= msg.guild.members.me.roles.highest.position) return msg.channel.send(`No puedo quitar ese rol debido a que es jerárquicamente igual o superior al mío.`);
                if(role.managed) return msg.channel.send(`${bot.getEmoji('error')} No puedes quitarle un rol que está gestionado.`);
                if(!member.roles.cache.has(role.id)) return msg.reply(`> **${member.user.tag}** no tenía ese rol.`);

                await member.roles.remove(role.id).then(() => {
                    return msg.reply(`> ${bot.getEmoji('check')} Se le ha quitado el rol **${role.name}** a **${member.user.tag}**.`);
                }).catch(error => msg.channel.send(`${bot.getEmoji('error')} Ocurrió un error al intentar quitar el rol:\n\`${error}\``));
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
