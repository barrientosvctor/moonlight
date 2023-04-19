import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "dog",
  description: "Muestra fotos de perritos.",
  cooldown: 3,
  aliases: ["dogs"],
  enabled: true,
  async run(bot, msg) {
    try {
      const data = await fetch("https://api.thedogapi.com/v1/images/search", { method: "GET" }).then(res => res.json());
      if (!data) return msg.reply(bot.replyMessage("No fue posible encontrar una imagen.", { emoji: "error" }))

      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setDescription("¡Mira este lindo perrito!")
      .setImage(data[0].url);
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
