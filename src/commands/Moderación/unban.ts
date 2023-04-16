import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "unban",
  description: "Quita el ban de un usuario baneado anteriormente del servidor.",
  cooldown: 3,
  usage: "<ID>",
  example: "112233445566778899",
  enabled: true,
  memberPerms: ["BanMembers"],
  botPerms: ["BanMembers"],
  async run(bot, msg, args, prefix, getUser) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escriba la ID del usuario para quitarle su ban.", { mention: msg.author.username, emoji: "noargs" }));

      const user = await getUser(args[1]);
      if (!user) return msg.reply(bot.replyMessage("Este usuario no existe. Prueba con otro.", { emoji: "error" }));

      if (user === msg.author) return msg.reply(bot.replyMessage("No puedes quitarte el ban a ti mismo.", { emoji: "error" }));
      if (user === msg.guild?.members.me?.user) return msg.reply(bot.replyMessage("Sigo aquí.", { emoji: "error" }));

      await msg.guild.members.unban(user.id, `Usuario desbaneado por: ${msg.author.tag}`).then(user => {
        return msg.reply(bot.replyMessage(`**${user.tag}** (\`${user.id}\`) acaba de ser quitado de la lista de baneos del servidor.`, { emoji: "check" }));
      }).catch(() => msg.reply(bot.replyMessage("Este usuario no ha sido baneado anteriormente.", { emoji: "error" })));
    } catch (err) {
      bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
