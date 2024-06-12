import { EmbedBuilder, bold, hyperlink } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js"
import { CommandType } from "../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.User,
  name: "Avatar",
  category: "Utilidad",
  async run(interaction) {
    if (!interaction.guild) return;

    const member = interaction.guild.members.cache.get(interaction.targetId);
    if (!member) return;

    const embed = new EmbedBuilder()
    .setColor("Random")
    .setDescription(
      `
> Avatar de ${bold(member.user.tag)}
${hyperlink("PNG", member.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true }))} | ${hyperlink("JPG", member.displayAvatarURL({ size: 2048, extension: "jpg", forceStatic: true }))} | ${hyperlink("WEBP", member.displayAvatarURL({ size: 2048, extension: "webp", forceStatic: true }))} ${member.avatar?.startsWith("a_") ? `| ${hyperlink("GIF", member.displayAvatarURL({ size: 2048, extension: "gif" }))}` : ""}
`
    )
    .setImage(member.user.displayAvatarURL({ size: 2048, extension: "png" }));
    return interaction.reply({ embeds: [embed] });
  }
});
