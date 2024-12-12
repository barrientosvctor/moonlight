import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  inlineCode,
  roleMention
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("muterole")
    .setDescription("Mute role commands.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(cmd =>
      cmd
        .setName("set")
        .setDescription("Sets a mute role in bot for guild.")
        .addRoleOption(r =>
          r
            .setName("role")
            .setDescription("Choose a role to be used when a mute is executed.")
            .setRequired(true)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("delete")
        .setDescription("Removes the mute role configured in their guild.")
    )

    .addSubcommand(cmd =>
      cmd
        .setName("list")
        .setDescription("Shows the actual mute role established in the guild.")
    ),
  testGuildOnly: true,
  enabled: false,
  async run(interaction, client) {
    if (!interaction.inGuild() || !interaction.guild)
      return interaction.reply({
        content: "Este comando debe usarse en un servidor.",
        ephemeral: true
      });

    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "set") {
      const role = interaction.options.getRole("role", true);

      if (client.database.has("muterole", interaction.guild.id))
        await client.database.modify("muterole", interaction.guild.id, role.id);
      else await client.database.add("muterole", interaction.guild.id, role.id);

      return interaction.reply("Rol establecido éxitosamente!");
    } else if (subcommand === "delete") {
      if (client.database.has("muterole", interaction.guild.id))
        await client.database.delete("muterole", interaction.guild.id);
      else
        return interaction.reply({
          content: "No tenía establecido anteriormente un rol para ello.",
          ephemeral: true
        });

      return interaction.reply("Rol eliminado éxitosamente.");
    } else if (subcommand === "list") {
      if (!client.database.has("muterole", interaction.guild.id))
        return interaction.reply({
          content: `No hay roles para mostrar. Para establecer uno usa ${inlineCode(`/${this.data.name} set @rol`)}`,
          ephemeral: true
        });

      const roleId = client.database.get("muterole", interaction.guild.id)!;

      return interaction.reply(`
# Rol para mutear
- ${roleMention(roleId)} (${inlineCode(roleId)})
`);
    }

    return;
  }
});
