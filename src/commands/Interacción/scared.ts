import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "scared",
  description: "Estás asutao.",
  cooldown: 3,
  enabled: true,
  async run(bot, msg) {
    try {
      const data = await fetch(`https://kawaii.red/api/gif/scared/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
      const embed = new EmbedBuilder()

      .setColor("Random")
      .setImage(data.response)
      .setDescription(`**${msg.author.username}** se siente asustado...`);
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
