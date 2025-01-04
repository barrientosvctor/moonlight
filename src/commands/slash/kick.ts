import {
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from their guild.")
    .setDescriptionLocalizations({
      "es-ES": "Expulsa a un miembro de su servidor."
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(user =>
      user
        .setName("member")
        .setDescription("Choose the guild member to kick.")
        .setDescriptionLocalizations({
          "es-ES": "Elige al miembro de su servidor para expulsar."
        })
        .setRequired(true)
    )
    .addStringOption(input =>
      input
        .setName("reason")
        .setDescription("Write a reason why you're kicking this member.")
        .setDescriptionLocalizations({
          "es-ES":
            "Escriba una razón del por qué estás expulsando a éste miembro."
        })
        .setRequired(false)
        .setMinLength(0)
        .setMaxLength(255)
    ),
  clientPermissions: ["KickMembers"],
  async run(interaction) {
    if (!interaction.inGuild() || !interaction.guild)
      return interaction.reply({
        content: "Éste comando debe usarse en un servidor.",
        ephemeral: true
      });

    const member = interaction.options.getMember("member") as GuildMember;

    if (!member)
      return interaction.reply({
        content: "Éste usuario no está en el servidor.",
        ephemeral: true
      });

    const reason = interaction.options.getString("reason") ?? "Ninguno.";

    if (member.user.id === interaction.user.id)
      return interaction.reply({
        content: "No te puedes expulsar a ti mismo, prueba con otro.",
        ephemeral: true
      });
    if (member.user.id === interaction.guild.members.me?.user.id)
      return interaction.reply({
        content: "No puedes hacer eso.",
        ephemeral: true
      });
    const author = await interaction.guild.members.fetch(interaction.user.id);
    if (member.roles.highest.position >= author.roles.highest.position)
      return interaction.reply({
        content: `No puedes expulsar a ${member.user.username} debido a que cuenta con un rol igual o superior al tuyo.`,
        ephemeral: true
      });
    if (!member.manageable)
      return interaction.reply({
        content: `No puedo expulsar a ${member.user.username} ya que tiene un rol igual o superior al mío.`,
        ephemeral: true
      });
    if (!member.kickable)
      return interaction.reply({
        content: `Es imposible expulsar a ${member.user.username}.`,
        ephemeral: true
      });

    try {
      await member.kick(reason);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content:
          "Hubo un error al intentar expulsar al usuario del servidor. Vuelve a intentar más tarde.",
        ephemeral: true
      });
    }

    return interaction.reply(
      `# Usuario expulsado éxitosamente!\n\n> ${member.user.username} (\`${member.user.id}\`)\nRazón: ${reason}`
    );
  }
});
