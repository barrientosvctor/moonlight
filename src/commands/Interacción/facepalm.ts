import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "facepalm",
  description: "Estás decepcionado.",
  cooldown: 3,
  enabled: true,
  async run(bot, msg) {
    try {
      const data = await fetch(`https://kawaii.red/api/gif/facepalm/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
      let embed = new EmbedBuilder();

      embed.setColor("Random")
      embed.setImage(data.response)
      embed.setDescription(`**${msg.author.username}** está decepcionado.`);
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
