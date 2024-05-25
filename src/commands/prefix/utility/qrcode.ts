import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
const HTTP_Regex = /^(http|https):/; //g

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "qrcode",
  description: "Genera códigos QR con una url.",
  cooldown: 10,
  aliases: ["qr"],
  usage: "<url>",
  example: "https://youtube.com",
  category: "Utilidad",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("escribe la URL que contendrá el código QR.", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );
    if (!HTTP_Regex.test(args[1]))
      return message.reply(
        client.beautifyMessage(
          "Tu URL es inválida, asegurate de que empiece con el protocolo HTTP.",
          { emoji: "error" }
        )
      );

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`> ${bold("URL")}: ${args[1]}`)
      .setImage(
        `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${args[1]}`
      );
    return message.reply({ embeds: [embed] });
  }
});
