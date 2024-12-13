import {
  APIUser,
  ApplicationCommandType,
  ContextMenuCommandBuilder,
  EmbedBuilder,
  Routes
} from "discord.js";
import { ContextMenu } from "../../structures/CommandBuilder.js";

export default new ContextMenu({
  data: new ContextMenuCommandBuilder()
    .setName("Member Info")
    .setType(ApplicationCommandType.User)
    .setDMPermission(false),
  async run(interaction, client) {
    if (!interaction.guild || !interaction.member) return;

    if (!interaction.inCachedGuild())
      return interaction.reply({
        content: client.beautifyMessage(
          "Para seguir, esta interacción debe estar en cache.",
          { emoji: "error" }
        ),
        ephemeral: true
      });

    const member = interaction.guild.members.cache.get(interaction.targetId);
    if (!member)
      return interaction.reply({
        content: client.beautifyMessage("No existe este usuario.", {
          emoji: "error"
        }),
        ephemeral: true
      });

    const data = (await client.rest.get(
      Routes.user(member.user.id)
    )) as APIUser;
    const embed = new EmbedBuilder().setColor(data.accent_color || "Random");

    embed
      .setThumbnail(
        member.user.displayAvatarURL({ size: 2048, extension: "png" }) || null
      )
      .setTitle(
        `Información del ${member.user.bot ? "bot" : "miembro"} ${member.user.tag}`
      )
      .setDescription(
        `
**ID:** ${member.user.id}
**Avatar:** [Avatar de ${member.user.username}](${member.displayAvatarURL({ size: 2048, extension: "png" })})
**Banner:** ${data.banner ? `[Banner de ${member.user.username}](https://cdn.discordapp.com/banners/${member.user.id}/${data.banner}.${data.banner.startsWith("a_") ? "gif" : "png"}?size=2048)` : data.accent_color ? `\`${data.accent_color.toString(16)}\`` : "No tiene banner"}
**Fecha de creación:** <t:${Math.ceil(member.user.createdTimestamp / 1000)}>
**Insignias:** ${
          member.user.flags
            ?.toArray()
            .map(flag => `${client.wrapper.get("flags", flag)}`)
            .join(", ") || "No tiene insignias"
        }
**Apodo:** ${member.nickname || "No tiene apodo"}
**Fecha de ingreso:** <t:${Math.ceil(member.joinedTimestamp! / 1000)}>`
      )
      .addFields({
        name: `Roles (${
          member.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(role => role !== interaction.guild.roles.everyone)
            .map(role => role).length
        })`,
        value:
          member.roles.cache
            .sort((a, b) => b.position - a.position)
            .filter(role => role !== interaction.guild.roles.everyone)
            .map(role => role)
            .join(", ") || "No tiene roles."
      });

    return interaction.reply({ embeds: [embed] });
  }
});
