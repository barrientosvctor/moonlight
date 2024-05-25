import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
import { fetchAnimeGIF } from "../../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "dance",
  description: "Baila felizmente!",
  cooldown: 3,
  category: "Reacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("dance"),
      embed = new EmbedBuilder()
        .setColor("Random")
        .setImage(data.url)
        .setDescription(`${bold(message.author.username)} está bailando.`);

    return message.channel.send({ embeds: [embed] });
  }
});
