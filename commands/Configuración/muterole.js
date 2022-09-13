let Command = require('../../base/models/Command'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Command({
    name: 'muterole',
    description: 'Establece el rol para mutear a los miembros del servidor.',
    cooldown: 3,
    aliases: ['mrole', 'mutedrole'],
    category: 'Configuración',
    usage: '<@rol | ID>',
    example: '@Silenciado',
    enabled: true,
    botPerms: ['MANAGE_ROLES', 'MANAGE_CHANNELS'],
    memberPerms: ['MANAGE_ROLES'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`set\`: Establece un nuevo rol para mutear.\n\`remove\`: Quita el rol ya establecido.`);
            if(!['set', 'remove'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida.`);

            let db = new database('./databases/muterole.json'),
            embed = new discord.MessageEmbed();

            if(args[1] === 'set') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del rol que se les dará a los miembros muteados a partir de ahora`);
                
                /** @type {discord.Role} */
                let role = getRole(args[2]);
                if(!role) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese rol no pertenece al servidor.`);
                if(role.permissions.toArray().length !== 0) return msg.channel.send(`${bot.getEmoji('error')} El rol no debe tener ningún permiso activado para que cumpla su función.\n\n**- Permisos activados:** ${role.permissions.toArray().map(perm => `${bot.utils.guild.roles.permissions[perm]}`).join(', ')}`);
                if(db.has(msg.guildId) && role.id === await db.get(msg.guildId)) return msg.reply(`${bot.getEmoji('error')} El rol **${role.name}** ya estaba establecido como rol para mutear.`);

                db.set(msg.guildId, role.id);
                msg.channel.send(`${bot.getEmoji('check')} ¡El rol **${role.name}** ha sido establecido como rol para mutear en el servidor!`);
                msg.channel.send(`${bot.getEmoji('waiting')} Configurando permisos del rol en cada canal, por favor espere...`)
                msg.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').forEach(async channel => {
                    await channel.permissionOverwrites.edit(role.id, { SEND_MESSAGES: false, ADD_REACTIONS: false, CONNECT: false, SPEAK: false }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} No se pudo aplicar la configuración de permisos en <#${error.path.split('/')[2]}>. Asegurate que mi rol o el de los bots tenga permitido ver ese canal.`));
                });
                msg.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async channel => {
                    await channel.permissionOverwrites.edit(role.id, { SEND_MESSAGES: false, ADD_REACTIONS: false }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} No se pudo aplicar la configuración de permisos en <#${error.path.split('/')[2]}>. Asegurate que mi rol o el de los bots tenga permitido ver ese canal.`));
                });
                msg.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').forEach(async channel => {
                    await channel.permissionOverwrites.edit(role.id, { CONNECT: false, SPEAK: false }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} No se pudo aplicar la configuración de permisos en <#${error.path.split('/')[2]}>. Asegurate que mi rol o el de los bots tenga permitido ver ese canal.`));
                });
                msg.channel.send(`${bot.getEmoji('check')} ¡Configuración completada éxitosamente!`);
            } else if(args[1] === 'remove') {
                if(db.has(msg.guildId)) {
                    db.delete(msg.guildId);
                    return msg.reply(`> ${bot.getEmoji('check')} Se ha removido correctamente el rol establecido anteriormente en el servidor.`);
                } else return msg.reply(`> ${bot.getEmoji('error')} No se ha configurado un rol para mutear en el servidor. Para eso haz uso del comando \`${prefix}muterole set\`.`);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});