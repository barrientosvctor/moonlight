import { EmbedBuilder, codeBlock } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { inspect } from "node:util";

export default new LegacyCommandBuilder({
  name: "eval",
  cooldown: 10,
  category: "Desarrollador",
  description: "Ejecuta código.",
  usage: "<expresión>",
  example: "2+2",
  ownerOnly: true,
  async run(client, message, args) {
    const embed = new EmbedBuilder();
    let isError = false;

    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("Escribe el código a ejecutar.", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );
    const argument = args.slice(1).join(" ");

    let result;
    try {
      result = eval(argument);
    } catch (error) {
      result = error;
      isError = true;
    }

    if (isError) {
      let errorMessage = (result as Object).toString();

      if (errorMessage.length > 1024)
        errorMessage = `${errorMessage.slice(0, 1024 - 50)}...`;

      embed
        .setColor("Red")
        .setTitle("Hubo un error al evaluar el código.")
        .addFields({
          name: "Error",
          value: `${codeBlock("js", errorMessage)}`
        });
    } else {
      embed
        .setColor("Green")
        .setTitle("¡Código evaluado correctamente!")
        .setDescription(
          `**Tipo:** ${codeBlock("prolog", typeof result)}\n**Evaluado en:** ${codeBlock("yaml", `${Date.now() - message.createdTimestamp}ms`)}\n**Salida:** ${codeBlock("js", inspect(result, { depth: 0 }))}`
        );
    }

    return message.reply({ embeds: [embed] });
  }
});
