import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { fetchAnimeGIF } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "cry",
  description: "Solo llora.",
  cooldown: 3,
  category: "Interacción",
  async run(_, message) {
    const data = await fetchAnimeGIF("cry"),
      embed = new EmbedBuilder()
        .setDescription(`**${message.author.username}** está llorando.`)
        .setColor("DarkGrey")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
