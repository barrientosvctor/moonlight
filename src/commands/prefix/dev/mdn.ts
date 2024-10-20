import { EmbedBuilder, hyperlink } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "mdn",
  cooldown: 10,
  category: "Desarrollador",
  description:
    "Muestra información de la documentación de Mozilla Developer Network",
  usage: "<busqueda>",
  example: "Array.prototype.map()",
  ownerOnly: true,
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Escribe lo que quieres buscar en la documentación.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const data = await fetch(
      `https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(args.slice(1).join(" "))}&locale=es`
    ).then(res => res.json());
    const msg: string[] = [];

    for (const doc of data.documents) {
      msg.push(
        `> ${hyperlink(doc.title, `https://developer.mozilla.org${doc.mdn_url}`)}`
      );
    }

    const embed = new EmbedBuilder()
      .setDescription(msg.join("\n"))
      .setTitle(`Resultados con: ${args.slice(1).join(" ")}`);
    return message.reply({ embeds: [embed] });
  }
});
