import {
  EmbedBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  bold,
  hyperlink
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
import { EmojiManager } from "../../structures/EmojiManager.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("utility")
    .setDescription("Utility commands.")
    .setDescriptionLocalizations({
      "es-ES": "Comandos de utilidad."
    })
    .addSubcommand(cmd =>
      cmd
        .setName("avatar")
        .setDescription("Shows the avatar of a Discord user.")
        .setDescriptionLocalizations({
          "es-ES": "Muestra el avatar de un usuario de Discord."
        })
        .addUserOption(user =>
          user
            .setName("user")
            .setDescription("Choose or type the ID of a Discord user.")
            .setDescriptionLocalizations({
              "es-ES": "Elige o escribe la ID del usuario de Discord."
            })
            .setRequired(true)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("math")
        .setDescription("Resolves mathematical operations.")
        .setDescriptionLocalizations({
          "es-ES": "Resuelve operaciones matemáticas."
        })
        .addStringOption(input =>
          input
            .setName("operation")
            .setDescription("Type the mathematical operation to resolve.")
            .setDescriptionLocalizations({
              "es-ES": "Escriba la operación matemática a resolver."
            })
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(255)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("morse")
        .setDescription("Translates text to morse.")
        .setDescriptionLocalizations({
          "es-ES": "Traduce texto a morse."
        })
        .addStringOption(input =>
          input
            .setName("text")
            .setDescription("Type the text to translate.")
            .setDescriptionLocalizations({
              "es-ES": "Escriba el texto a traducir."
            })
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(255)
        )
    )
    .addSubcommandGroup(group =>
      group
        .setName("emoji")
        .setDescription("Manage your guild's emojis")
        .setDescriptionLocalizations({
          "es-ES": "Gestiona los emojis de tu servidor."
        })
        .addSubcommand(cmd =>
          cmd
            .setName("add")
            .setDescription("Adds a new emoji to guild.")
            .setDescriptionLocalizations({
              "es-ES": "Agrega un nuevo emoji al servidor."
            })
            .addStringOption(opt =>
              opt
                .setName("name")
                .setDescription("The emoji's name.")
                .setMinLength(1)
                .setMaxLength(32)
                .setRequired(true)

                .setDescriptionLocalizations({
                  "es-ES": "El nombre del emoji."
                })
            )
            .addAttachmentOption(opt =>
              opt
                .setName("emoji")
                .setDescription("Attach the emoji (image/gif) here.")
                .setRequired(true)
                .setDescriptionLocalizations({
                  "es-ES": "Anexa el emoji (imagen/gif) aquí"
                })
            )
        )

        .addSubcommand(cmd =>
          cmd
            .setName("rename")
            .setDescription("Renames the name of an emoji.")
            .setDescriptionLocalizations({
              "es-ES": "Renombra el nombre de un emoji."
            })

            .addStringOption(opt =>
              opt
                .setName("name")
                .setDescription("The emoji's name.")
                .setMinLength(1)
                .setMaxLength(32)
                .setRequired(true)

                .setDescriptionLocalizations({
                  "es-ES": "El nombre del emoji."
                })
            )

            .addStringOption(opt =>
              opt
                .setName("new_name")
                .setDescription("The new name of that emoji.")
                .setMinLength(1)
                .setMaxLength(32)
                .setRequired(true)

                .setDescriptionLocalizations({
                  "es-ES": "El nuevo nombre del emoji."
                })
            )
        )

        .addSubcommand(cmd =>
          cmd
            .setName("remove")
            .setDescription("Removes an emoji from guild.")
            .setDescriptionLocalizations({
              "es-ES": "Elimina un emoji del servidor."
            })

            .addStringOption(opt =>
              opt
                .setName("name")
                .setDescription("The emoji's name.")
                .setMinLength(1)
                .setMaxLength(32)
                .setRequired(true)

                .setDescriptionLocalizations({
                  "es-ES": "El nombre del emoji."
                })
            )
        )
    ),
  async run(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group) {
      if (group === "emoji") {
        const emojis = await interaction.guild?.emojis.fetch();

        if (subcommand === "add") {
          if (
            !interaction.memberPermissions?.has(
              PermissionFlagsBits.CreateGuildExpressions
            )
          ) {
            return interaction.reply({
              content: `No posees el permiso de ${bold(client.convertPermissionsToSpanish(["CreateGuildExpressions"]).toString())} para ejecutar este comando.`,
              ephemeral: true
            });
          }

          const name = interaction.options.getString("name", true);
          const attch = interaction.options.getAttachment("emoji", true);
          const targetEmojiId = EmojiManager.GetTargetEmojiId(emojis!, name);

          if (targetEmojiId) {
            return interaction.reply({
              content: "Ya existe un emoji con este nombre.",
              ephemeral: true
            });
          }

          await interaction.guild?.emojis.create({
            name,
            attachment: attch.url,
            reason: `Emoji creado por ${interaction.user.username}`
          });

          return interaction.reply({
            content: `Se ha creado exitosamente el emoji ${bold(name)}.`
          });
        } else if (subcommand === "rename") {
          if (
            !interaction.memberPermissions?.has(
              PermissionFlagsBits.ManageGuildExpressions
            )
          ) {
            return interaction.reply({
              content: `No posees el permiso de ${bold(client.convertPermissionsToSpanish(["ManageGuildExpressions"]).toString())} para ejecutar este comando.`,
              ephemeral: true
            });
          }

          const name = interaction.options.getString("name", true);
          const new_name = interaction.options.getString("new_name", true);
          const targetEmojiId = EmojiManager.GetTargetEmojiId(emojis!, name);

          if (!targetEmojiId) {
            return interaction.reply({
              content: "Este emoji no pertenece al servidor.",
              ephemeral: true
            });
          }

          await emojis!.get(targetEmojiId)!.edit({
            name: new_name,
            reason: `Nombre cambiado por ${interaction.user.username}`
          });

          return interaction.reply({
            content: `El nombre del emoji ha sido cambiado correctamente a ${bold(new_name)}.`
          });
        } else {
          // `delete` command.

          if (
            !interaction.memberPermissions?.has(
              PermissionFlagsBits.ManageGuildExpressions
            )
          ) {
            return interaction.reply({
              content: `No posees el permiso de ${bold(client.convertPermissionsToSpanish(["ManageGuildExpressions"]).toString())} para ejecutar este comando.`,
              ephemeral: true
            });
          }

          const name = interaction.options.getString("name", true);
          const targetEmojiId = EmojiManager.GetTargetEmojiId(emojis!, name);

          if (!targetEmojiId) {
            return interaction.reply({
              content: "Este emoji no pertenece al servidor.",
              ephemeral: true
            });
          }

          const targetEmoji = emojis!.get(targetEmojiId)!;

          if (!targetEmoji.deletable) {
            return interaction.reply({
              content: "Este emoji no puede ser eliminado.",
              ephemeral: true
            });
          }

          await targetEmoji.delete(
            `Emoji borrado por ${interaction.user.username}`
          );

          return interaction.reply({
            content: `El emoji ${bold(name)} ha sido borrado correctamente.`
          });
        }
      }
    } else {
      if (subcommand === "avatar") {
        const user = interaction.options.getUser("user", true);
        if (!user)
          return interaction.reply({
            content: "Usuario no encontrado.",
            ephemeral: true
          });

        const embed = new EmbedBuilder()
          .setColor("Random")
          .setDescription(
            `
> Avatar de ${bold(user.tag)}
${hyperlink("PNG", user.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true }))} | ${hyperlink("JPG", user.displayAvatarURL({ size: 2048, extension: "jpg", forceStatic: true }))} | ${hyperlink("WEBP", user.displayAvatarURL({ size: 2048, extension: "webp", forceStatic: true }))} ${user.avatar?.startsWith("a_") ? `| ${hyperlink("GIF", user.displayAvatarURL({ size: 2048, extension: "gif" }))}` : ""}
`
          )
          .setImage(
            user.avatar?.startsWith("a_")
              ? user.displayAvatarURL({ size: 2048, extension: "gif" })
              : user.displayAvatarURL({ size: 2048, extension: "png" })
          );

        return interaction.reply({ embeds: [embed] });
      } else if (subcommand === "math") {
        const operation = interaction.options.getString("operation", true);
        const text = await fetch(
          `https://api.mathjs.org/v4/?expr=${operation.replace(`+`, `%2B`).replace(`^`, `%5E`).replace(`/`, `%2F`)}`
        ).then(res => res.text());

        return interaction.reply(text);
      } else if (subcommand === "morse") {
        const data = await fetch(
          `https://api.popcat.xyz/texttomorse?text=${encodeURIComponent(interaction.options.getString("text", true))}`,
          {
            method: "GET"
          }
        ).then(res => res.json());
        if (data.error)
          return interaction.reply({
            content: "Hubo un error externo al intentar convertir el texto.",
            ephemeral: true
          });

        return interaction.reply(data.morse);
      }
    }

    return interaction.reply({
      content: "Haz uso de los diferentes subcomandos que trae éste comando.",
      ephemeral: true
    });
  }
});
