import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { fetchAnimeGIF } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "facepalm",
  description: "Decepcionado...",
  cooldown: 3,
  category: "Reacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("facepalm"),
      embed = new EmbedBuilder()
        .setDescription(`${bold(message.author.username)} está decepcionado.`)
        .setColor("DarkGrey")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
