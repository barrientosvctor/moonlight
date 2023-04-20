import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "rps",
  description: "Piedra, papel o tijera contra mí.",
  cooldown: 3,
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("Debes especificar una opción. (piedra / papel / tijera)", { mention: msg.author.username, emoji: "noargs" }));
      if (!["piedra", "papel", "tijera"].includes(args[1].toLowerCase())) return msg.channel.send(bot.replyMessage("Debes especificar una opción válida. (piedra / papel / tijera)", { emoji: "error" }));
      const botChoice = ["piedra", "papel", "tijera"][Math.floor(Math.random() * 3)];
      return msg.reply(bot.rps(args[1], botChoice));
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
