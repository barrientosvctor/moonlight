import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { fetchAnimeGIF } from "../../../util/functions.js";

export default new LegacyCommandBuilder({
  name: "scared",
  description: "D:",
  cooldown: 3,
  category: "Reacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("scared"),
      embed = new EmbedBuilder()
        .setDescription(`¡${bold(message.author.username)} está asustado! D:`)
        .setColor("Random")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
