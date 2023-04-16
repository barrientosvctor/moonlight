import { ChannelType, TextChannel } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";
const HTTP_Regex = /^(http|https):///g

export default new CommandBuilder({
  name: "qrcode",
  description: "Genera códigos QR con una url.",
  cooldown: 3,
  aliases: ["qr"],
  usage: "<url>",
  example: "https://google.com",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe la URL que contendrá el código QR.", { mention: msg.author.username, emoji: "noargs" }));
      if (!HTTP_Regex.test(args[1])) return msg.reply(bot.replyMessage("Tu URL es inválida, asegurate de que empiece con el protocolo HTTP.", { emoji: "error" }));
      if (bot.blacklist_url_list.some(url => args[1].toLowerCase().includes(url))) return msg.reply(bot.replyMessage("Ese dominio está en la lista negra del bot.", { emoji: "error" }));
      if (bot.nsfw_url_list.some(url => args[1].toLowerCase().includes(url)) && (msg.channel instanceof TextChannel && !msg.channel.nsfw)) return msg.reply(bot.replyMessage("Para hacer esto debes de ejecutar el comando en un canal marcado cómo NSFW.", { emoji: "error" }));

      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setTitle("¡Código QR generado!")
      .setDescription(`URL: ${args[1]}`)
      .setImage(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${args[1]}`);
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
