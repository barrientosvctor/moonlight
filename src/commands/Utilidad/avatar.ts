import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "avatar",
  description: "Obten la foto de perfil de cualquier usuario de Discord.",
  cooldown: 3,
  aliases: ["av", "pfp"],
  usage: "[@usuario | ID]",
  example: "@Neon#0001",
  enabled: true,
  async run(bot, msg, args, prefix, getUser) {
    try {
      const user = await getUser(args[1]) || msg.author;
      if (!user) return msg.reply(bot.replyMessage("Usuario no encontrado.", { emoji: "error" }));

      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setDescription(`Avatar de ${user?.tag}\n[PNG](${user?.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true })}) | [JPG](${user?.displayAvatarURL({ size: 2048, extension: "jpg", forceStatic: true })}) | [WEBP](${user?.displayAvatarURL({ size: 2048, extension: "webp", forceStatic: true })}) ${user?.avatar.startsWith("a_") ? `| [GIF](${user?.displayAvatarURL({ size: 2048, extension: "gif" })})` : ``}\n[Búscalo en Google](https://lens.google.com/search?p=${encodeURIComponent(user?.displayAvatarURL({ size: 2048, extension: "png" }))})`)
      .setImage(user?.displayAvatarURL({ size: 2048, extension: "png" }));
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
