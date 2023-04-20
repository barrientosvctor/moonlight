import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "nickname",
  description: "Cambia el apodo de un miembro de su servidor.",
  cooldown: 3,
  aliases: ["nick", "username"],
  usage: "<@miembro | ID> <apodo>",
  example: "@Neon#0001 Shine",
  enabled: true,
  memberPerms: ["ManageNicknames"],
  botPerms: ["ManageNicknames"],
  async run(bot, msg, args, prefix, getUser, getMember) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("menciona o escriba la ID del miembro que va a cambiar su apodo.", { mention: msg.author.username, emoji: "noargs" }));

      const member = getMember(args[1]);
      if (!member) return msg.reply(bot.replyMessage("Este usuario no está en el servidor. Prueba con otro.", { emoji: "error" }));
      if (member.roles.highest.position >= msg.member!.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedes cambiar el apodo de este miembro debido a que cuenta con un rol igual o superior al tuyo.", { emoji: "error" }));
      if (!member.manageable) return msg.reply(bot.replyMessage(`No puedo cambiar el apodo de ${member.user?.tag} ya que tiene un rol igual o superior al mío.`, { emoji: "error" }));

      if (!args[2]) return msg.reply(bot.replyMessage(`Escribe el nuevo apodo que tendrá ${member.user?.username}`, { emoji: "noargs" }));
      if (args.slice(2).join(" ") === member.nickname) return msg.reply(bot.replyMessage(`${member.user.username} ya tenía ese apodo anteriormente.`, { emoji: "error" }));

      await member.setNickname(args.slice(2).join(" ")).then(async () => {
        msg.reply(bot.replyMessage(`Ahora el apodo de ${member.user?.tag} es **${member.nickname}**`, { emoji: "check" }));
      }).catch(err => {
        console.error(err);
        msg.channel.send(bot.replyMessage("Ocurrió un error al intentar cambiar el apodo de este usuario.", { emoji: "warning" }));
      });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
