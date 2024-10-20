import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { fetchAnimeGIF } from "../../../util/functions.js";

export default new LegacyCommandBuilder({
  name: "cry",
  description: "Solo llora.",
  cooldown: 3,
  category: "Reacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("cry"),
      embed = new EmbedBuilder()
        .setDescription(`${bold(message.author.username)} está llorando.`)
        .setColor("DarkGrey")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
