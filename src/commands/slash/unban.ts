import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription(
      "Remove the ban from their guild to some user previously banned."
    )
    .setDescriptionLocalizations({
      "es-ES":
        "Quita el ban de su servidor a algún usuario baneado anteriormente."
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(user =>
      user
        .setName("user")
        .setDescription("Type the user ID of the target to unban them.")
        .setDescriptionLocalizations({
          "es-ES": "Escriba el ID de usuario para quitarle el ban."
        })
        .setRequired(true)
    ),
  clientPermissions: ["BanMembers"],
  async run(interaction) {
    if (!interaction.inGuild() || !interaction.guild)
      return interaction.reply({
        content: "Para usar este comando debes de usarlo en un servidor.",
        ephemeral: true
      });

    const user = interaction.options.getUser("user", true);
    if (!user)
      return interaction.reply({
        content: "Este usuario no existe.",
        ephemeral: true
      });

    const bans = await interaction.guild.bans.fetch();

    if (!bans.has(user.id))
      return interaction.reply({
        content: `${user.username} no ha sido baneado anteriormente en el servidor.`,
        ephemeral: true
      });

    try {
      await interaction.guild.members.unban(
        user,
        `Ban quitado a ${user.username} por ${interaction.user.username}.`
      );
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content:
          "Hubo un error inesperado al intentar quitarle el ban a este usuario.",
        ephemeral: true
      });
    }

    return interaction.reply(
      `# Unban éxitoso!\n\nUsuario ${user.username} (\`${user.id}\`) fue eliminado de la lista de baneos.`
    );
  }
});
