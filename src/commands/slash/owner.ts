import { codeBlock, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
import { inspect } from "node:util";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("owner")
    .setDescription("Owner commands.")
    .setDescriptionLocalizations({
      "es-ES": "Comandos del dueño."
    })
    .addSubcommand(cmd =>
      cmd
        .setName("eval")
        .setDescription("Run some code.")
        .setDescriptionLocalizations({
          "es-ES": "Ejecuta algún código."
        })
        .addStringOption(input =>
          input
            .setName("code")
            .setDescription("Type the code to run.")
            .setDescriptionLocalizations({
              "es-ES": "Escribe el código a ejecutar."
            })
            .setMinLength(1)
            .setMaxLength(510)
            .setRequired(true)
        )
        .addBooleanOption(b =>
          b
            .setName("hidden")
            .setDescription("Should the bot response be hidden?")
            .setDescriptionLocalizations({
              "es-ES": "¿La respuesta del bot debería estar oculto?"
            })
            .setRequired(false)
        )
    ),
  ownerOnly: true,
  run(interaction) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "eval") {
      const code = interaction.options.getString("code", true);
      const hidden = interaction.options.getBoolean("hidden", false) ?? false;
      const embed = new EmbedBuilder();
      let isError = false;
      let result;

      try {
        result = eval(code);
      } catch (e) {
        result = e;
        isError = true;
      }

      if (isError) {
        embed
          .setColor("Red")
          .setTitle("Hubo un error al evaluar el código.")
          .addFields(
            { name: "Entrada", value: `${codeBlock("js", code)}` },
            { name: "Error", value: `${codeBlock("js", result)}` }
          );
      } else {
        embed
          .setColor("Green")
          .setTitle("¡Código evaluado correctamente!")
          .setDescription(
            `**Tipo:** ${codeBlock("prolog", typeof result)}\n**Evaluado en:** ${codeBlock("yaml", `${Date.now() - interaction.createdTimestamp}ms`)}\n**Entrada:** ${codeBlock("js", code)}\n**Salida:** ${codeBlock("js", inspect(result, { depth: 0 }))}`
          );
      }

      return interaction.reply({ embeds: [embed], ephemeral: hidden });
    }

    return interaction.reply({
      content: "Haz uso de los diferentes subcomandos que trae éste comando.",
      ephemeral: true
    });
  }
});
