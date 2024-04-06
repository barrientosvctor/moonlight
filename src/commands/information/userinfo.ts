import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { fetchToDiscordAPI, getMember, getUser } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "userinfo",
  cooldown: 5,
  category: "Información",
  description: "Da información sobre el usuario que me digas. Lo puedes mencionar o escribir su ID.",
  aliases: ["usrinfo"],
  usage: "[@usuario | <id>]",
  example: "@shawn",
  async run(client, message, args) {
    if (!message.inGuild()) return;

    const user = await getUser(args[1], client) || message.author
    const data = await fetchToDiscordAPI(`/users/${user.id}`);
    const embed = new EmbedBuilder().setColor(data.banner_color || "Random");

    if (!user)
      return message.reply(client.beautifyMessage("El usuario no fue encontrado.", { emoji: "error" }));

    if (!message.guild.members.cache.get(user.id)) {
      embed
        .setThumbnail(user.displayAvatarURL({ size: 2048, extension: "png" }))
        .setTitle(`Información del ${user.bot ? "bot" : "usuario"} ${user.tag}`)
        .setDescription(`
**ID:** \`${user.id}\`
**Avatar:** [Avatar de ${user.username}](${data.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${data.avatar}.${data.avatar.startsWith('a_') ? 'gif' : 'png'}?size=2048` : user.displayAvatarURL({ size: 2048, extension: "png" })})
**Banner:** ${data.banner ? `[Banner de ${user.username}](https://cdn.discordapp.com/banners/${user.id}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=2048)` : data.banner_color ? `\`${data.banner_color}\`` : "No tiene banner"}
**Fecha de creación:** <t:${Math.ceil(user.createdTimestamp / 1000)}>
**Insignias:** ${user.flags?.toArray().map(flag => `${client.wrapper.get("flags", flag)}`).join(', ') || 'No tiene insignias'}
`)
    } else {
      const member = getMember(user.id, message);
      if (!member)
        return message.reply(client.beautifyMessage("No se pudo encontrar al usuario.", { emoji: "error" }));

      embed
        .setThumbnail(member.user.displayAvatarURL({ size: 2048, extension: "png" }) || null)
        .setTitle(`Información del ${member.user.bot ? 'bot' : 'miembro'} ${member.user.tag}`)
        .setDescription(`
**ID:** ${member.user.id}
**Avatar:** [Avatar de ${member.user.username}](${member.displayAvatarURL({ size: 2048, extension: "png" })})
**Banner:** ${data.banner ? `[Banner de ${member.user.username}](https://cdn.discordapp.com/banners/${member.user.id}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=2048)` : data.banner_color ? `\`${data.banner_color}\`` : "No tiene banner"}
**Fecha de creación:** <t:${Math.ceil(member.user.createdTimestamp / 1000)}>
**Insignias:** ${member.user.flags?.toArray().map(flag => `${client.wrapper.get("flags", flag)}`).join(', ') || "No tiene insignias"}
**Apodo:** ${member.nickname || 'No tiene apodo'}
**Fecha de ingreso:** <t:${Math.ceil(member.joinedTimestamp! / 1000)}>`)
        .addFields({
          name: `Roles (${member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== message.guild.roles.everyone).map(role => role).length})`,
          value: member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== message.guild.roles.everyone).map(role => role).join(', ') || 'No tiene roles.'
        });
    }

    return message.reply({ embeds: [embed] });
  }
});
