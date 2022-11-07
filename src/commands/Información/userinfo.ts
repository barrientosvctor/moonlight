import { ActivityType } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder"
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "userinfo",
    description: "Muestra la información de cualquier usuario de Discord o de un miembro del servidor.",
    cooldown: 3,
    aliases: ["userinf", "usrinf", "usrinfo"],
    usage: "[@usuario | ID]",
    example: "Dazt#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole) {
        try {
            const user = await getUser(args[1]) || msg.member?.user;
            const data = await fetch(`https://discord.com/api/v10/users/${user?.id}`, { method: "get", headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` } }).then(res => res.json());
            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!);

            if (!user) return msg.reply(`No se encontró el usuario.`);

            embed.setColor(data.banner_color || "Random")
            if (!msg.guild?.members.cache.get(user.id)) {
                embed.setThumbnail(user.displayAvatarURL({ size: 2048, extension: "png" }))
                embed.setTitle(`Información del ${user.bot ? 'bot' : 'usuario'} ${user.tag}`)
                embed.setDescription(`
                **${user.bot ? 'Bot' : 'Usuario'}:** \`${user.tag}\`
                **ID:** \`${user.id}\`
                **Avatar:** [Avatar de ${user.username}](${data.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${data.avatar}.${data.avatar.startsWith('a_') ? 'gif' : 'png'}?size=2048` : user.displayAvatarURL({ size: 2048, extension: "png" }) })
                **Banner:** ${data.banner ? `[Banner de ${user.username}](https://cdn.discordapp.com/banners/${user.id}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=2048)` : data.banner_color ? `\`${data.banner_color}\`` : "No tiene banner"}
                **Fecha de creación:** <t:${Math.ceil(user.createdTimestamp / 1000)}>
                **Insignias:** ${user.flags?.toArray().map(flag => `${bot.utils.user.flags[flag]}`).join(', ') || 'No tiene insignias'}`)
            } else {
                const member = getMember(user.id);
                const clientStatus = [];
                const activities = [];
                let status = ``;
                let customStatus = ``;

                if (member?.presence) {
                    for (let activity of member.presence.activities) {
                        if (activity.type === ActivityType.Custom) {
                            customStatus = `${activity.emoji && activity.state ? `**Estado personalizado:** ${activity.emoji} ${activity.state}` : activity.state ? `**Estado personalizado:** ${activity.state}` : activity.emoji ? `**Estado personalizado:** ${activity.emoji}` : ``}`;
                        } else {
                            activities.push(`**- ${bot.utils.user.presence.activities.type[activity?.type]} ${activity.name}**${activity.details ? `\n\`${activity.details}\`` : ``}${activity.state ? `\n\`${activity.state}\`` : ``}\n<t:${Math.ceil(activity.createdTimestamp / 1000)}:R>`)
                        }
                    }
                    if (member?.presence?.clientStatus?.desktop) clientStatus.push("Escritorio")
                    if (member?.presence?.clientStatus?.mobile) clientStatus.push("Celular")
                    if (member?.presence?.clientStatus?.web) clientStatus.push("Navegador")

                    status = `**Estado:** ${bot.utils.user.presence.status[member.presence?.status]}${clientStatus.length !== 0 ? ` (${clientStatus.join(`, `)})` : ``}${customStatus !== `` ? `\n${customStatus}` : ``}${activities.length !== 0 ? `\n\n${activities.join(`\n`)}` : ``}`;
                } else {
                    status = `**Estado:** ${bot.utils.user.presence.status.offline}`;
                }

                embed.setThumbnail(member?.user.displayAvatarURL({ size: 2048, extension: "png" }) || null)
                embed.setTitle(`Información del ${member?.user.bot ? 'bot' : 'miembro'} ${member?.user.tag}`)
                embed.setDescription(`
                **${member?.user.bot ? 'Bot' : 'Miembro'}:** ${member?.user.tag}
                **ID:** ${member?.user.id}
                **Avatar:** [Avatar de ${member?.user.username}](${member?.displayAvatarURL({ size: 2048, extension: "png" })})
                **Banner:** ${data.banner ? `[Banner de ${member?.user.username}](https://cdn.discordapp.com/banners/${member?.user.id}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=2048)` : data.banner_color ? `\`${data.banner_color}\`` : "No tiene banner"}
                **Fecha de creación:** <t:${Math.ceil(member?.user.createdTimestamp! / 1000)}>
                **Insignias:** ${member?.user.flags?.toArray().map(flag => `${bot.utils.user.flags[flag]}`).join(', ') || "No tiene insignias"}
                **Apodo:** ${member?.nickname || 'No tiene apodo'}
                **Fecha de ingreso:** <t:${Math.ceil(member?.joinedTimestamp! / 1000)}>
                ${status}`)
                embed.addFields({ name: `Roles (${member?.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== msg.guild?.roles.everyone).map(role => role).length})`, value: member?.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== msg.guild?.roles.everyone).map(role => role).join(', ') || 'No tiene roles.' });
            }
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar obtener información del usuario.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
