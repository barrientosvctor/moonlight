import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
import { fetchAnimeGIF, getMember } from "../../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "pat",
  description: "Dale una palmadita en la cabeza a una persona del servidor.",
  cooldown: 3,
  usage: "<@usuario | ID>",
  example: "@neon",
  category: "Reacción",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "menciona a la persona que quieras darle una palmadita.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const member = await getMember(args[1], message),
      data = await fetchAnimeGIF("pat"),
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
          "No puedes darte una palmada a ti mismo, eso sería raro jeje.",
          { emoji: "error" }
        )
      );

    embed
      .setDescription(
        `¡${bold(message.author.username)} le dio una palmadita a ${bold(member.user.username)}!`
      )
      .setColor("Random")
      .setImage(data.url);
    return message.channel.send({ embeds: [embed] });
  }
});
