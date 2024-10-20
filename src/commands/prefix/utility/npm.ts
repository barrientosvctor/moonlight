import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "npm",
  description: "Busca paquetes de NPM.",
  cooldown: 10,
  usage: "<nombre>",
  example: "axios",
  category: "Utilidad",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Escribe el nombre de algún paquete que esté en la página de npmjs.com.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const data = await fetch(`https://api.popcat.xyz/npm?q=${args[1]}`, {
      method: "GET"
    }).then(res => res.json());
    if (data.error)
      return message.channel.send(
        client.beautifyMessage(
          `El paquete ${bold(args[1])} no pudo ser encontrado.`,
          { emoji: "error" }
        )
      );

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`Nombre: ${data.name}`).setDescription(`
${bold("Descripción")}: ${data.description}
${bold("Versión")}: ${data.version}
${bold("Palabras clave")}: ${data.keywords}
${bold("Autor")}: ${data.author} (${data.author_email})
${bold("Última publicación")}: ${data.last_published}
${bold("Mantenedores")}: ${data.maintainers}
${bold("Repositorio")}: ${data.repository}
${bold("Descargas este año")}: ${data.downloads_this_year}
`);
    return message.reply({ embeds: [embed] });
  }
});
