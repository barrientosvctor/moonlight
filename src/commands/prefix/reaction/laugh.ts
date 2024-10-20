import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { fetchAnimeGIF } from "../../../util/functions.js";

export default new LegacyCommandBuilder({
  name: "laugh",
  description: "XD",
  cooldown: 3,
  category: "Reacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("laugh"),
      embed = new EmbedBuilder()
        .setDescription(`${bold(message.author.username)} se ríe fuertemente.`)
        .setColor("Random")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
