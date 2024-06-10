import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
import { fetchAnimeGIF, getMember } from "../../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "hug",
  description: "Abraza a alguien del chat.",
  cooldown: 3,
  usage: "<@usuario | ID>",
  example: "@fede",
  category: "Reacción",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("menciona a la persona que quieras abrazar.", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );

    const member = await getMember(args[1], message),
      data = await fetchAnimeGIF("hug"),
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
        client.beautifyMessage(
          "No puedes abrazarte a ti mismo, eso sería muy raro jeje.",
          { emoji: "error" }
        )
      );

    embed
      .setColor("Random")
      .setDescription(
        `¡${bold(message.author.username)} le dio un fuerte abrazo a ${bold(member.user.username)}!`
      )
      .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
