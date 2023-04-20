import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "8ball",
  description: "Preguntale cosas a la bola mágica.",
  cooldown: 3,
  usage: "<pregunta>",
  example: "Esto es un ejemplo?",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe una pregunta para la bola mágica.", { mention: msg.author.username, emoji: "noargs" }));
      const resp = ["Sí.", "No.", "Lo dudo.", "Lo dudo mucho.", "Estoy indeciso.", "No puedo responder esa pregunta en este momento.", "Como yo lo veo, sí.", "Me parece que sí.", "No lo creo.", "Sin duda", "Tal vez no", "¿Y si no?", "¿Qué clase de pregunta es esa ${message.author.username}?", "Tal vez sí.", "Puede ser.", "Tu pregunta me hizo dudar.", "Sin lugar a dudas.", "Sí, definitivamente.", "Muy dudoso.", "Respuesta confusa, vuelve a intentarlo.", "Mis fuentes dicen que no.", "No cuentes con ello.", "No te puedo responder esa pregunta ahora.", "Vuelve a preguntar más tarde.", "Tal vez."];
      return msg.reply(`:8ball: **${resp[Math.floor(Math.random() * resp.length)]}**`);
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
