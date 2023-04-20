import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "steam",
  description: "Busca juegos de Steam con este comando.",
  cooldown: 3,
  usage: "<nombre de juego>",
  example: "Resident Evil 4",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el nombre de un juego de Steam.", { mention: msg.author.username, emoji: "noargs" }));

      const data = await fetch(`https://api.popcat.xyz/steam?q=${args.slice(1).join(" ").replace(" ", "%20")}`, { method: "GET" }).then(res => res.json());
      if (data.error) return msg.channel.send(bot.replyMessage(`El juego **${args.slice(1).join(" ")}** no pudo ser encontrado en Steam.`, { emoji: "error" }));

      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setTitle(data.name)
      .setThumbnail(data.thumbnail)
      .setImage(data.banner)
      .setDescription(`${data.description}\n\n**Tipo de producto:** ${data.type}\n**Precio:** ${data.price}\n**Página web:** ${data.website}\n**Desarrolladores:** ${data.developers.map(dev => dev).join(", ")}\n**Editores:** ${data.publishers.map(pub => pub).join(", ")}`);
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
