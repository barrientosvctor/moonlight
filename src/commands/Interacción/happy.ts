import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "happy",
  description: "Estás feliz!",
  cooldown: 3,
  enabled: true,
  async run(bot, msg) {
    try {
      const data = await fetch(`https://kawaii.red/api/gif/happy/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
      const embed = new EmbedBuilder()

      .setDescription(`¡**${msg.author.username}** está feliz!`)
      .setColor("Random")
      .setImage(data.response);
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
