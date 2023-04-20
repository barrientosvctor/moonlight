import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "binary",
  description: "Encripta o desencripta mensajes en binario.",
  cooldown: 3,
  usage: "<decode / encode> <texto>",
  example: "encode Mensaje de prueba",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escriba alguna de las siguientes opciones:\n`encode`: Encripta texto a binario.\n`decode`: Desencripta binario a texto.", { mention: msg.author.username, emoji: "noargs" }));
      if (!["decode", "encode"].includes(args[1])) return msg.reply(bot.replyMessage("Opción no válida.", { emoji: "error" }));
      if (!args[2]) return msg.channel.send(bot.replyMessage("escribe el texto o binario que vas a encriptar o desencriptar.", { mention: msg.author.username, emoji: "noargs" }));
      if (args.slice(2).join(" ").length > 500) return msg.reply(bot.replyMessage(`El texto no puede tener más de 500 carácteres. Tu texto contiene **${args.slice(2).join(" ").length}** carácteres.`, { emoji: "error" }));

      let data;
      if (args[1] === "encode") {
        data = await fetch(`https://some-random-api.ml/binary?text=${encodeURIComponent(args.slice(2).join(" "))}`, { method: "GET" }).then(res => res.json());
        return msg.reply(`${data.binary}`);
      } else {
        data = await fetch(`https://some-random-api.ml/binary?decode=${encodeURIComponent(args[2])}`, { method: "GET" }).then(res => res.json());
        return msg.reply(`${data.text}`);
      }
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
