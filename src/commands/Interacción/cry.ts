import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "cry",
  description: "Solo llora.",
  cooldown: 3,
  enabled: true,
  async run(bot, msg) {
    try {
      const data = await fetch(`https://kawaii.red/api/gif/cry/token=${process.env.KAWAII_TOKEN}/`, { method: 'GET' }).then(res => res.json());
      const embed = new EmbedBuilder()
      .setDescription(`**${msg.author.username}** está llorando.`)
      .setColor("DarkGrey")
      .setImage(data.response);

      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
