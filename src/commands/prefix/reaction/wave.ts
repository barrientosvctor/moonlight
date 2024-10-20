import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { fetchAnimeGIF } from "../../../util/functions.js";

export default new LegacyCommandBuilder({
  name: "wave",
  description: "Saluda a todos.",
  cooldown: 3,
  category: "Reacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("wave"),
      embed = new EmbedBuilder()
        .setDescription(
          `${bold(message.author.username)} está saludando a todos en el chat!`
        )
        .setColor("Random")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
