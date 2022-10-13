let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'userinfo',
    description: 'Obtiene información de un usuario',
    cooldown: 3,
    aliases: ['ui', 'user'],
    category: 'Información',
    usage: '<@usuario | ID>',
    example: '@Shawn#1662',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
	    /** @type {discord.User} */
            const user = await getUser(args[1]) || msg.member.user;
            const data = await fetch(`https://discord.com/api/v9/users/${user.id}`, { method: 'GET', headers: { Authorization: `Bot ${process.env.login}` }}).then(res => res.json());
            let embed = new discord.EmbedBuilder();
            if(!user) return msg.channel.send('No se pudo encontrar el usuario.');
            embed.setColor(data.banner_color ? data.banner_color : 'Random')
            if(!msg.guild.members.cache.get(user.id)) {
                embed.setThumbnail(user.displayAvatarURL({ extension: 'png', size: 2048 }))
                embed.setTitle(`Información del ${user.bot ? 'bot' : 'usuario'} ${user.tag}`)
                embed.setDescription(`
                **${user.bot ? 'Bot' : 'Usuario'}:** \`${user.tag}\`
                **ID:** \`${user.id}\`
                **Avatar:** [Avatar de ${user.username}](${data.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${data.avatar}.${data.avatar.startsWith('a_') ? 'gif' : 'png'}?size=2048` : user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true }) })
                **Banner:** ${data.banner ? `[Banner de ${user.username}](https://cdn.discordapp.com/banners/${user.id}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=2048)` : data.banner_color ? `\`${data.banner_color}\`` : 'No tiene banner'}
                **Fecha de creación:** <t:${Math.ceil(user.createdTimestamp / 1000)}>
                **Insignias:** ${user.flags.toArray().map(flag => `${bot.utils.user.flags[flag]}`).join(', ') || 'No tiene insignias'}`)
            } else {
		/** @type {discord.GuildMember} */
                let member = getMember(user.id);
                let status = ``;
                let customStatus = ``;
                let clientStatus = [];
                let activities = [];

                if(member.presence) {
                    for (let activity of member.presence.activities) {
                        if(activity.type === discord.ActivityType.Custom) {
                            customStatus = `${activity.emoji && activity.state ? `**Estado personalizado:** ${activity.emoji} ${activity.state}` : activity.state ? `**Estado personalizado:** ${activity.state}` : activity.emoji ? `**Estado personalizado:** ${activity.emoji}` : ``}`;
                        } else {
                            activities.push(`**- ${bot.utils.user.presence.activities.type[activity.type]} ${activity.name}**${activity.details ? `\n\`${activity.details}\`` : ``}${activity.state ? `\n\`${activity.state}\`` : ``}\n<t:${Math.ceil(activity.createdTimestamp / 1000)}:R>`)
                        }
                    };

                    if(member.presence.clientStatus.desktop) clientStatus.push('Escritorio');
                    if(member.presence.clientStatus.mobile) clientStatus.push('Celular');
                    if(member.presence.clientStatus.web) clientStatus.push('Navegador');

                    status = `**Estado:** ${bot.utils.user.presence.status[member.presence.status]}${clientStatus.length !== 0 ? ` (${clientStatus.join(`, `)})` : ``}${customStatus !== `` ? `\n${customStatus}` : ``}${activities.length !== 0 ? `\n\n${activities.join(`\n`)}` : ``}`;
                } else {
                    status = `**Estado:** ${bot.utils.user.presence.status.offline}`;
                }
                embed.setThumbnail(member.user.displayAvatarURL({ extension: 'png', size: 2048 }))
                embed.setTitle(`Información del ${member.user.bot ? 'bot' : 'miembro'} ${member.user.tag}`)
                embed.setDescription(`
                **${member.user.bot ? 'Bot' : 'Miembro'}:** ${member.user.tag}
                **ID:** ${member.user.id}
                **Avatar:** [Avatar de ${member.user.username}](${member.displayAvatarURL({ extension: 'png', size: 2048 })})
                **Banner:** ${data.banner ? `[Banner de ${member.user.username}](https://cdn.discordapp.com/banners/${member.user.id}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=2048)` : data.banner_color ? `\`${data.banner_color}\`` : 'No tiene banner'}
                **Fecha de creación:** <t:${Math.ceil(member.user.createdTimestamp / 1000)}>
                **Insignias:** ${member.user.flags.toArray().map(flag => `${bot.utils.user.flags[flag]}`).join(', ') || 'No tiene insignias'}

                **Apodo:** ${member.nickname || 'No tiene apodo'}
                **Booster:** ${member.premiumSince ? `Sí es booster (<t:${Math.ceil(member.premiumSince / 1000)}>)` : 'No es booster'}
                **Fecha de ingreso:** <t:${Math.ceil(member.joinedTimestamp / 1000)}>
                ${status}`)
                embed.addFields({ name: `Roles (${member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== msg.guild.roles.everyone).map(role => role).length})`, value: member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== msg.guild.roles.everyone).map(role => role).join(', ') || 'No tiene roles.' });
            }
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar obtener los datos del usuario.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
