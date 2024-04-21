import { EmbedBuilder, bold, hyperlink } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getUser } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "avatar",
  description: "Obtén la foto de perfil de cualquier usuario de Discord.",
  cooldown: 10,
  aliases: ["av", "pfp"],
  usage: "[@usuario | ID]",
  example: "@shawn",
  category: "Utilidad",
  async run(client, message, args) {
const user = await getUser(args[1], client) || message.author;
      if (!user) return message.reply(client.beautifyMessage("Usuario no encontrado.", { emoji: "error" }));

      const embed = new EmbedBuilder()
    .setColor("Random")
      .setDescription(`
> Avatar de ${bold(user.tag)}
${hyperlink("PNG", user.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true }))} | ${hyperlink("JPG", user.displayAvatarURL({ size: 2048, extension: "jpg", forceStatic: true }))} | ${hyperlink("WEBP", user.displayAvatarURL({ size: 2048, extension: "webp", forceStatic: true }))} ${user.avatar?.startsWith("a_") ? `| ${hyperlink("GIF", user.displayAvatarURL({ size: 2048, extension: "gif"}))}` : ""}
`)
      .setImage(user.avatar?.startsWith("a_") ? user.displayAvatarURL({ size: 2048, extension: "gif" }) : user.displayAvatarURL({ size: 2048, extension: "png" }));

      return message.reply({ embeds: [embed] });
  }
});
