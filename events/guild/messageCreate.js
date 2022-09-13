let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
Timeout = new Map();

module.exports = {
    name: 'messageCreate',
    /**
     * 
     * @param {Moonlight} bot 
     * @param {discord.Message} msg 
     */
    async run(bot, msg) {
        try {
            let prefix = await bot.getPrefix(msg.guildId);
            if(msg.content.match(new RegExp(`^<@!?${bot.user.id}>( |)$`))) msg.channel.send(`¡Hola ${msg.author.username}! Mi nombre es ${bot.user.username}, para conocer mis comandos escribe \`${prefix}help\``);
        
            let args = msg.content.substring(prefix.length).split(' '),
            cmd = bot.cmds.find(cmd => cmd.name === args[0].toLowerCase() || cmd.aliases && cmd.aliases.includes(args[0].toLowerCase()));
            if(!args[0] || msg.author.bot || !msg.content.startsWith(prefix)) return;
            
            /** @param {discord.User} user */
            function getUser(user) {
                if(!user) return;
                else {
                    if(user.startsWith('\\')) user = user.slice(1);
                    if(user.startsWith('<@') && user.endsWith('>')) {
                        user = user.slice(2, -1);
                        if(user.startsWith('!')) user = user.slice(1);
                    }
                    if(isNaN(user) && user.length !== 18) return;
                    }
                    return bot.users.fetch(user);
                }

            /** @param {discord.GuildMember} member */
            function getMember(member) {
                if(!member) {
                    return;
                } else {
                    if(member.startsWith('\\')) member = member.slice(1);
                    if(member.startsWith('<@') && member.endsWith('>')) {
                        member = member.slice(2, -1);
                        if(member.startsWith('!')) member = member.slice(1);
                    }
                    if(isNaN(member) && member.length !== 18) return;
                }
                return msg.guild.members.cache.get(member);
            }

            /** @param {discord.Role} role */
            function getRole(role) {
                if(!role) return;
                else {
                    if(role.startsWith('\\')) role = role.slice(1);
                    if(role.startsWith('<@&') && role.endsWith('>')) role = role.slice(3, -1);
                    if(isNaN(role) && role.length !== 18) return;
                }
                return msg.guild.roles.cache.get(role);
            }

            /** @param {discord.GuildChannel} channel */
            function getChannel(channel) {
                if(!channel) return;
                else {
                    if(channel.startsWith('\\')) channel = channel.slice(1);
                    if(channel.startsWith('<#') && channel.endsWith('>')) channel = channel.slice(2, -1);
                    if(isNaN(channel) && channel.length !== 18) return;
                }
                return msg.guild.channels.cache.get(channel);
            }

            if(cmd) {
                if(cmd.ownerOnly && ![bot.application.owner.id, bot.application.dev.id].includes(msg.author.id)) return;
                if(cmd.nsfwOnly && !msg.channel.nsfw) return msg.reply(`Tu busqueda puede contener contenido para adultos, dirigete a un canal marcado cómo NSFW.`);
                if(!cmd.enabled) return msg.reply('Este comando está deshabilitado temporalmente.');
                if(!msg.member.permissions.has(cmd.memberPerms || [])) return msg.reply(`No tienes un rol que tenga los siguientes permisos para utilizar este comando:\n- ${cmd.memberPerms.map(perm => `**${bot.utils.guild.roles.permissions[perm]}**`).join(', ')}.`);
                if(!msg.guild.me.permissions.has(cmd.botPerms || [])) return msg.reply(`Para terminar la acción requiero de un rol que tenga los siguientes permisos:\n- ${cmd.botPerms.map(perm => `**${bot.utils.guild.roles.permissions[perm]}**`).join(', ')}.`);
                if(!msg.guild.me.permissions.has('VIEW_CHANNEL' || 'SEND_MESSAGES' || 'EMBED_LINKS')) return msg.reply(`Para usar cualquiera de mis comandos, necesito los permisos **Ver canal**, **Enviar mensajes** y **Adjuntar links**.`);

                // Cooldown system
                if(cmd.cooldown) {
                    if(!Timeout.has(cmd.name)) Timeout.set(cmd.name, new discord.Collection());

                    let time_stamps = Timeout.get(cmd.name),
                    cooldown_amount = (cmd.cooldown) * 1000;

                    if(time_stamps.has(msg.author.id)) {
                        let expiration_time = time_stamps.get(msg.author.id) + cooldown_amount;

                        if(Date.now() < expiration_time) {
                            let time_left = (expiration_time - Date.now()) / 1000;
                            return msg.channel.send(`Oye no tan rápido! Espera ${time_left < 1 ? 'unos segundos más' : time_left.toFixed(0) === 1 ? '*1 segundo*' : time_left.toFixed(0) >= 2 ? `*${time_left.toFixed(0)} segundos*` : `*${time_left.toFixed(0)} segundos*`} para volver a usar el comando **${cmd.name}**.`).then(m => setTimeout(() => m.delete(), cooldown_amount)).catch(err => {});
                        }
                    }
                    time_stamps.set(msg.author.id, Date.now());
                    setTimeout(() => time_stamps.delete(msg.author.id), cooldown_amount);
                }

                try {
                    cmd.run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel);
                    bot.channels.cache.get('958831716485701713').send(`• ──────────── ✾ ──────────── •\nâ€¢ **Comando:** ${cmd.name}\nâ€¢ **Usuario:** ${msg.author.tag} (\`${msg.author.id}\`)\nâ€¢ **Servidor:** ${msg.guild.name} (\`${msg.guildId}\`)`);
                } catch (error) {
                    console.error(error);
                }
            } else return;
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
