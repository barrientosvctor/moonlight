import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "cat",
  description: "Muestra fotos de gatitos.",
  cooldown: 3,
  aliases: ["cats"],
  enabled: true,
  async run(bot, msg) {
    try {
      const data = await fetch(`https://api.thecatapi.com/v1/images/search`).then(res => res.json());
      if (!data) return msg.reply(bot.replyMessage("No fue posible encontrar una imagen.", { emoji: "error" }))

      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setDescription("¡Mira este lindo gatito!")
      .setImage(data[0].url);
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
