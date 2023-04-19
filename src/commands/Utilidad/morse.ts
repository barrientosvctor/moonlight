import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "morse",
  description: "Convierte texto a código morse.",
  cooldown: 3,
  usage: "<texto>",
  example: "Un texto",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el texto que vas a convertir en código morse.", { mention: msg.author.username, emoji: "noargs" }));

      const data = await fetch(`https://api.popcat.xyz/texttomorse?text=${args.slice(1).join(" ").replace(" ", "%20")}`, { method: "GET" }).then(res => res.json());
      if(data.error) return msg.channel.send(bot.replyMessage("Hubo un error externo al intentar convertir el texto.", { emoji: "error" }));

      return msg.reply(`${data.morse}`);
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
