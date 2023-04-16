import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "translate",
  description: "Traduce un mensaje al idioma que gustes.\nPara conocer los códigos de lenguaje haz click [aquí](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)",
  cooldown: 3,
  usage: "<código de lenguaje> <texto>",
  example: "es Hello everyone!",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el código de idioma que quieres traducir el texto.\nPara conocer los códigos de idioma disponibles haz click en la siguiente URL: <https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>", { mention: msg.author.username, emoji: "noargs" }));
      if (!bot.utils.translate[args[1]]) return msg.reply(bot.replyMessage("Ese código de idioma no es válido!\nPara conocer los códigos de idioma disponibles haz click en la siguiente URL: <https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes>", { emoji: "error" }));
      if (!args[2]) return msg.channel.send(bot.replyMessage(`escribe el texto que vas a traducir al idioma ${bot.utils.translate[args[1]]}.`, { mention: msg.author.username, emoji: "noargs" }));

      const data = await fetch(`https://api.popcat.xyz/translate?to=${args[1]}&text=${args.slice(2).join(" ")}`, { method: "GET" }).then(res => res.json());
      return msg.reply(`> Traducción al idioma ${bot.utils.translate[args[1]]}: ${data.translated}`);
    } catch (err) {
      bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
