import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "invite",
  description: "Aquí está el botón para invitar al bot a su servidor.",
  cooldown: 3,
  aliases: ["iv"],
  enabled: true,
  async run(bot, msg) {
    try {
      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setTitle("Enlace de invitación")
      .setDescription(`Me parece que quieres agregarme a tu servidor, lo puedes hacer pulsando el botón que está abajo. Gracias por considerar añadir a Moonlight a su servidor! ❤️`)
      .setImage(bot.utils.botInfo.banner);

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Link)
          .setLabel("¡Invítame!")
          .setEmoji("❤️")
          .setURL(bot.utils.botInfo.invite)
      );

      return msg.reply({ embeds: [embed], components: [row] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
