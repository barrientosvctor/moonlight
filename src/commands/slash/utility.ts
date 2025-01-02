import { EmbedBuilder, SlashCommandBuilder, bold, hyperlink } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

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
    ),
  async run(interaction, _) {
    const subcommand = interaction.options.getSubcommand();

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

    return interaction.reply({
      content: "Haz uso de los diferentes subcomandos que trae éste comando.",
      ephemeral: true
    });
  }
});
