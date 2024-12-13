import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  type GuildMember
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("untimeout")
    .setDescription("Removes the timeout to a guild member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(user =>
      user
        .setName("member")
        .setDescription("Choose a member to remove their time out.")
        .setRequired(true)
    )
    .addStringOption(input =>
      input
        .setName("reason")
        .setDescription(
          "Write the reason why you're removing the timeout to this member."
        )
        .setRequired(false)
        .setMinLength(0)
        .setMaxLength(255)
    ),
  testGuildOnly: true,
  clientPermissions: ["ModerateMembers"],
  async run(interaction) {
    const member = interaction.options.getMember("member") as GuildMember;
    const reason =
      interaction.options.getString("reason") ??
      `Aislamiento quitado por ${interaction.user.username}.`;

    if (!member.isCommunicationDisabled())
      return interaction.reply({
        content: "Este usuario no estaba aislado!",
        ephemeral: true
      });

    try {
      await member.timeout(null, reason);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content:
          "No es posible quitarle el aislamiento a éste usuario, intenta más tarde.",
        ephemeral: true
      });
    }

    return interaction.reply(`${member.user.username} dejó de estar aislado.`);
  }
});