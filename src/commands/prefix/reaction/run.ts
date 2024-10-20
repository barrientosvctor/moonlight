import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { fetchAnimeGIF } from "../../../util/functions.js";

export default new LegacyCommandBuilder({
  name: "run",
  description: "Corre!",
  cooldown: 3,
  category: "Reacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("run"),
      embed = new EmbedBuilder()
        .setDescription(`¡${bold(message.author.username)} está corriendo!`)
        .setColor("Random")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
