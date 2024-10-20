import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { fetchAnimeGIF, getMember } from "../../../util/functions.js";

export default new LegacyCommandBuilder({
  name: "punch",
  description: "Golpea a alguien del servidor.",
  cooldown: 3,
  usage: "<@usuario | ID>",
  example: "@neon",
  category: "Reacción",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "tienes que mencionar a la persona que vas a golpear.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const member = await getMember(args[1], message),
      data = await fetchAnimeGIF("punch"),
      embed = new EmbedBuilder();

    if (!member)
      return message.reply(
        client.beautifyMessage(
          "No pude encontrar a esa persona en el servidor.",
          { emoji: "error" }
        )
      );
    if (member.user.id === message.author.id)
      return message.reply(
        client.beautifyMessage("¿Te harías daño a ti mismo? ¿estás loco?", {
          emoji: "error"
        })
      );

    embed
      .setDescription(
        `¡${bold(message.author.username)} golpeó a ${bold(member.user.username)}!`
      )
      .setColor("Random")
      .setImage(data.url);
    return message.channel.send({ embeds: [embed] });
  }
});
