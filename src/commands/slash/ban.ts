import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a Discord user or a guild member from their guild.")
    .setDescriptionLocalizations({
      "es-ES": "Banea a un usuario de Discord o miembro de su servidor."
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(user =>
      user
        .setName("user")
        .setDescription(
          "Choose or type the user ID of a Discord user or a guild member."
        )
        .setDescriptionLocalizations({
          "es-ES":
            "Elige o escriba el ID de un usuario de Discord o miembro de su servidor."
        })
        .setRequired(true)
    )
    .addStringOption(input =>
      input
        .setName("reason")
        .setDescription("Type the ban reason.")
        .setDescriptionLocalizations({
          "es-ES": "Escriba la razón del ban."
        })
        .setRequired(false)
        .setMinLength(1)
        .setMaxLength(255)
    ),
  clientPermissions: ["BanMembers"],
  async run(interaction) {
    if (
      !interaction.inGuild() ||
      !interaction.guild ||
      !interaction.guild.members.me
    )
      return interaction.reply({
        content: "Este comando debe usarse en un servidor.",
        flags: "Ephemeral"
      });

    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") ?? "Ninguno.";
    if (!user)
      return interaction.reply({
        content: "Usuario no encontrado.",
        flags: "Ephemeral"
      });
    if (user.id === interaction.user.id)
      return interaction.reply({
        content: "No puedes banearte a tí mismo.",
        flags: "Ephemeral"
      });

    if (user.id === interaction.guild.members.me.user.id)
      return interaction.reply({
        content: "No puedes banearme con mis comandos.",
        flags: "Ephemeral"
      });

    const bans = await interaction.guild.bans.fetch();

    if (bans.has(user.id))
      return interaction.reply({
        content: "Éste usuario ya estaba baneado.",
        flags: "Ephemeral"
      });

    const member = interaction.guild.members.cache.get(user.id),
      author = interaction.guild.members.cache.get(interaction.user.id);

    if (member) {
      if (
        author &&
        member.roles.highest.position >= author.roles.highest.position
      )
        return interaction.reply({
          content: `No puedes banear a ${member.user.username} debido a que tiene un rol igual o superior al tuyo.`,
          flags: "Ephemeral"
        });

      if (!member.manageable)
        return interaction.reply({
          content: `No puedo banear a ${member.user.username} debido a que tiene un rol igual o superior al mío.`,
          flags: "Ephemeral"
        });

      if (!member.bannable)
        return interaction.reply({
          content: `No puedo banear a ${member.user.username}.`,
          flags: "Ephemeral"
        });
    }

    await interaction.guild.members.ban(user, { reason });

    return interaction.reply(
      `# Usuario baneado éxitosamente\n\n> **${user.username}** (\`${user.id}\`)\nRazón: ${reason}`
    );
  }
});
