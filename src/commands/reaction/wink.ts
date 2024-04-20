import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { fetchAnimeGIF, getMember } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "wink",
  description: "Guiña el ojo a una persona del servidor.",
  cooldown: 3,
  usage: "[@usuario | ID]",
  example: "@darz",
  category: "Reacción",
  async run(client, message, args) {
    const data = await fetchAnimeGIF("wink"),
      embed = new EmbedBuilder().setColor("Random").setImage(data.url);

    if (!args[1])
      embed.setDescription(`${bold(message.author.username)} guiña el ojo.`);
    else {
      const member = getMember(args[1], message);

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
            "No puedes guiñarte el ojo a ti mismo, eso sería muy raro jeje.",
            { emoji: "error" }
          )
        );

      embed.setDescription(
        `¡${bold(message.author.username)} le guiñó el ojo a ${bold(member.user.username)}!`
      );
    }

    return message.channel.send({ embeds: [embed] });
  }
});
