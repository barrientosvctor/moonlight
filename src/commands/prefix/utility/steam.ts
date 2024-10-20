import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "steam",
  description: "Busca juegos de Steam con este comando.",
  cooldown: 10,
  usage: "<nombre>",
  example: "Resident Evil 4 (2005)",
  category: "Utilidad",
  ownerOnly: true,
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("escribe el nombre de un juego de Steam.", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );

    const game = args.slice(1).join(" ");

    const data = await fetch(
      `https://api.popcat.xyz/steam?q=${encodeURIComponent(game)}`,
      { method: "GET" }
    ).then(res => res.json());

    if (data.error)
      return message.channel.send(
        client.beautifyMessage(
          `El juego ${bold(game)} no pudo ser encontrado en Steam.`,
          { emoji: "error" }
        )
      );

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(data.name)
      .setThumbnail(data.thumbnail)
      .setImage(data.banner).setDescription(`
${data.description}

${bold("Tipo de producto")}: ${data.type}
${bold("Precio")}: ${data.price}
${bold("Página web")}: ${data.website}
${bold("Desarrolladores")}: ${data.developers.map((dev: string) => dev).join(", ")}
${bold("Editores")}: ${data.publishers.map((pub: string) => pub).join(", ")}`);
    return message.reply({ embeds: [embed] });
  }
});
