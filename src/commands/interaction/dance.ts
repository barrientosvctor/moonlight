import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { fetchAnimeGIF, getMember } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "dance",
  description: "Baila con una persona del servidor o solo.",
  cooldown: 3,
  usage: "[@usuario | ID]",
  example: "@jessica",
  category: "Interacción",
  async run(client, message, args) {
    const data = await fetchAnimeGIF("dance"),
      embed = new EmbedBuilder()
        .setColor("Random")
        .setImage(data.url);

    if (!args[1]) {
      embed.setDescription(`${bold(message.author.username)} está bailando.`);
    } else {
      const member = getMember(args[1], message);
      if (!member)
        return message.reply(client.beautifyMessage("Este usuario no está en el servidor.", { emoji: "error" }));
      if (member.user.id === message.author.id)
        return message.reply(client.beautifyMessage("No puedes bailar con ti mismo, eso sería raro jeje.", { emoji: "error", mention: message.author.username }));

      embed.setDescription(`${bold(message.author.username)} está bailando con ${bold(member.user.username)}.`)
    }

    return message.channel.send({ embeds: [embed] });
  }
});
