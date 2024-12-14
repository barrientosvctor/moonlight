import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  inlineCode,
  roleMention
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
import { Database } from "../../structures/Database.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("muterole")
    .setDescription("Mute role commands.")
    .setDescriptionLocalizations({
      "es-ES": "Comandos para el rol silenciar."
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand(cmd =>
      cmd
        .setName("set")
        .setDescription("Sets a mute role in bot for guild.")
        .setDescriptionLocalizations({
          "es-ES": "Establece un rol silenciar en el bot para el servidor."
        })
        .addRoleOption(r =>
          r
            .setName("role")
            .setDescription("Choose a role to be used when a mute is executed.")
            .setDescriptionLocalizations({
              "es-ES":
                "Elige un rol para ser usado cuando un mute sea ejecutado."
            })
            .setRequired(true)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("delete")
        .setDescription("Removes the mute role configured in their guild.")
        .setDescriptionLocalizations({
          "es-ES": "Quita el rol silenciar configurado en su servidor."
        })
    )

    .addSubcommand(cmd =>
      cmd
        .setName("list")
        .setDescription("Shows the actual mute role established in the guild.")
        .setDescriptionLocalizations({
          "es-ES": "Muestra el rol silenciar actual establecido en su servidor."
        })
    ),
  testGuildOnly: true,
  ownerOnly: true,
  enabled: false,
  async run(interaction) {
    if (!interaction.inGuild() || !interaction.guild)
      return interaction.reply({
        content: "Este comando debe usarse en un servidor.",
        ephemeral: true
      });

    const subcommand = interaction.options.getSubcommand();
    const db = Database.instance;

    if (subcommand === "set") {
      const role = interaction.options.getRole("role", true);

      if (db.has("muterole", interaction.guild.id))
        await db.modify("muterole", interaction.guild.id, role.id);
      else await db.add("muterole", interaction.guild.id, role.id);

      return interaction.reply("Rol establecido éxitosamente!");
    } else if (subcommand === "delete") {
      if (db.has("muterole", interaction.guild.id))
        await db.delete("muterole", interaction.guild.id);
      else
        return interaction.reply({
          content: "No tenía establecido anteriormente un rol para ello.",
          ephemeral: true
        });

      return interaction.reply("Rol eliminado éxitosamente.");
    } else if (subcommand === "list") {
      if (!db.has("muterole", interaction.guild.id))
        return interaction.reply({
          content: `No hay roles para mostrar. Para establecer uno usa ${inlineCode(`/${this.data.name} set @rol`)}`,
          ephemeral: true
        });

      const roleId = db.get("muterole", interaction.guild.id)!;

      return interaction.reply(`
# Rol para mutear
- ${roleMention(roleId)} (${inlineCode(roleId)})
`);
    }

    return;
  }
});
