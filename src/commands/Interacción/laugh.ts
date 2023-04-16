import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "laugh",
  description: "Riete a carcajadas!",
  cooldown: 3,
  enabled: true,
  async run(bot, msg) {
    try {
      const data = await fetch(`https://kawaii.red/api/gif/laugh/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
      let embed = new EmbedBuilder();

      embed.setColor("Random")
      embed.setDescription(`¡**${msg.author.username}** se está riendo a carcajadas!`)
      embed.setImage(data.url);
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
