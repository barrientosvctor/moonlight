import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { fetchAnimeGIF, getMember } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "slap",
  description: "Abofetea a alguien del servidor.",
  cooldown: 3,
  usage: "<@usuario | ID>",
  example: "@fede",
  category: "Reacción",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(client.beautifyMessage("debes mencionar a una persona para darle una bofetada.", { mention: message.author.username, emoji: "error" }));

    const member = getMember(args[1], message),
      data = await fetchAnimeGIF("slap"),
      embed = new EmbedBuilder();

    if (!member)
      return message.reply(client.beautifyMessage("no pude encontrar a esa persona en el servidor.", { emoji: "error" }));
    if (member.user.id === message.author.id)
      return message.reply(client.beautifyMessage("¿Quieres hacerte daño? ¿estás loco?", { emoji: "error" }));

    embed
      .setColor("Random")
      .setImage(data.url)
      .setDescription(`¡${bold(message.author.username)} le dio una bofetada a ${bold(member.user.username)}!`);
    return message.channel.send({ embeds: [embed] });
  }
});
