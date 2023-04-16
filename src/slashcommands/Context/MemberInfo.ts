import { ActivityType, GuildMember, User } from "discord.js";
import { ContextMenuBuilder } from "../../structures/ContextMenuBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new ContextMenuBuilder()
.setName("Member Info")
.setType(2)
.setCallback(async ({ bot, interaction }) => {
  try {
    const member = interaction.guild.members.cache.get(interaction.targetId);
    if (!member) return;

    const data = await fetch(`https://discord.com/api/v10/users/${member.user?.id}`, { method: "get", headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` } }).then(res => res.json());
    const embed = new MoonlightEmbedBuilder(interaction.user, interaction.guild!);

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
    embed.setColor(data.banner_color || "Random")
    embed.addFields({ name: `Roles (${member?.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== interaction.guild?.roles.everyone).map(role => role).length})`, value: member?.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== interaction.guild?.roles.everyone).map(role => role).join(', ') || 'No tiene roles.' });
    return interaction.reply({ embeds: [embed] });
  } catch (err) {
    console.error(err);
  }
});
