import {
  PermissionFlagsBits,
  type Role,
  SlashCommandBuilder,
  bold,
  inlineCode,
  roleMention
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("Auto role commands.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommandGroup(group =>
      group
        .setName("set")
        .setDescription("Set commands.")
        .addSubcommand(cmd =>
          cmd
            .setName("user")
            .setDescription("Sets an auto role for new users.")
            .addRoleOption(r =>
              r
                .setName("role")
                .setDescription("Choose a role to assign to new users.")
                .setRequired(true)
            )
        )
        .addSubcommand(cmd =>
          cmd
            .setName("bot")
            .setDescription("Sets an auto role for new bots.")
            .addRoleOption(r =>
              r
                .setName("role")
                .setDescription("Choose a role to assign to new bots.")
                .setRequired(true)
            )
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName("delete")
        .setDescription("Delete commands.")
        .addSubcommand(cmd =>
          cmd.setName("user").setDescription("Removes the auto role for users.")
        )
        .addSubcommand(cmd =>
          cmd.setName("bot").setDescription("Removes the auto role for bots.")
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("list")
        .setDescription(
          "Shows the auto roles established for users and bots in their guild."
        )
    ),
  testGuildOnly: true,
  clientPermissions: ["ManageRoles"],
  async run(interaction, client) {
    if (!interaction.inGuild() || !interaction.guild)
      return interaction.reply({
        content: "Este comando debe usarse en un servidor.",
        ephemeral: true
      });

    const group = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();

    if (!group) {
      if (subcommand === "list") {
        const list = [];
        if (client.database.has("autorole", `user-${interaction.guild.id}`))
          list.push(
            `- ${bold("Usuarios")}: ${roleMention(client.database.get("autorole", `user-${interaction.guild.id}`)!)}`
          );

        if (client.database.has("autorole", `bot-${interaction.guild.id}`))
          list.push(
            `- ${bold("Bots")}: ${roleMention(client.database.get("autorole", `bot-${interaction.guildId}`)!)}`
          );

        if (list.length === 0)
          return interaction.reply({
            content: "No hay roles establecidos para mostrar acá.",
            ephemeral: true
          });

        return interaction.reply(`# Lista de autoroles

${list.join("\n")}`);
      } else {
        return interaction.reply({
          content: "Comando no preparado. Intenta más tarde.",
          ephemeral: true
        });
      }
    } else {
      if (group === "set") {
        const targetRole = interaction.options.getRole("role") as Role;

        if (targetRole === interaction.guild.roles.everyone)
          return interaction.reply({
            content: "No puedes agregar ese rol, prueba con otro.",
            ephemeral: true
          });

        const key = `${subcommand}-${interaction.guild.id}`;

        if (
          interaction.guild.members.me?.roles.highest.position &&
          targetRole.position >=
            interaction.guild.members.me?.roles.highest.position
        )
          return interaction.reply({
            content:
              "No puedo añadir este rol debido a que jerárquicamente tiene un puesto mayor o igual al mío.",
            ephemeral: true
          });

        const authorMember = await interaction.guild.members.fetch(
          interaction.user.id
        );
        if (targetRole.position >= authorMember.roles.highest.position)
          return interaction.reply({
            content:
              "No puedes añadir el rol ya que jerárquicamente tiene un puesto mayor o igual al tuyo!",
            ephemeral: true
          });

        if (targetRole.managed)
          return interaction.reply({
            content:
              "No puedo asignar roles que estén administrados por una integración, prueba con otro.",
            ephemeral: true
          });

        if (
          client.database.has("autorole", key) &&
          client.database.get("autorole", key) === targetRole.id
        )
          return interaction.reply({
            content: `Este rol ya ha sido establecido anteriormente para los ${subcommand === "user" ? "usuarios" : "bots"}, prueba con otro.`,
            ephemeral: true
          });

        if (client.database.has("autorole", key))
          await client.database.modify("autorole", key, targetRole.id);
        else await client.database.add("autorole", key, targetRole.id);

        return interaction.reply(
          `A partir de ahora, éste rol será asignado a todos los ${subcommand === "user" ? "usuarios" : "bots"} que entren al servidor.`
        );
      } else if (group === "delete") {
        const key = `${subcommand}-${interaction.guild.id}`;

        if (!client.database.has("autorole", key))
          return interaction.reply({
            content: `No hay ningún rol para eliminar. Para añadir uno, usa el comando: ${inlineCode(`/${this.data.name} set ${subcommand} @rol`)}`,
            ephemeral: true
          });

        await client.database.delete("autorole", key);

        return interaction.reply("Rol eliminado de la lista éxitosamente.");
      }
    }

    return;
  }
});
