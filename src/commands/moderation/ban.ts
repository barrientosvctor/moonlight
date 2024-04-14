import { bold, inlineCode } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getUser } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "ban",
  cooldown: 5,
  category: "Moderación",
  description: "Banea a cualquier usuario aunque no esté en el servidor. También elimina los mensajes de la última semana.",
  usage: "<@usuario | ID> [razón]",
  example: "@Neon noob",
  requiredClientPermissions: ["BanMembers"],
  requiredMemberPermissions: ["BanMembers"],
  async run(client, message, args) {
    if (!message.inGuild()) return;
    if (!args[1])
      return message.channel.send(client.beautifyMessage("Menciona o escriba la ID del miembro que va a banear del servidor.", { mention: message.author.username, emoji: "noargs" }));

    const user = await getUser(args[1], client);
    if (!user)
      return message.reply(client.beautifyMessage("Este usuario no existe. Prueba con otro.", { emoji: "error" }));

    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No hubo razón.";
    if (reason.length >= 511) reason = `${reason.slice(0, 508)}...`;

    if (message.guild.members.cache.has(user.id)) {
      const member = message.guild.members.cache.get(user.id);
      if (!member)
        return message.reply(client.beautifyMessage("No se pudo encontrar al usuario en el servidor.", { emoji: "error" }));
      if (!message.member) return;
      if (member === message.member)
        return message.reply(client.beautifyMessage("No te puedes banear a ti mismo, prueba con otro.", { emoji: "error" }));
      if (member === message.guild.members.me)
        return message.reply("¿Por qué yo?");
      if (member.roles.highest.position >= message.member!.roles.highest.position)
        return message.reply(client.beautifyMessage(`No puedes banear a ${bold(member.user.tag)} debido a que cuenta con un rol igual o superior al tuyo.`, { emoji: "error" }));
      if (!member.manageable)
        return message.reply(client.beautifyMessage(`No puedo banear a ${bold(member.user.tag)} ya que tiene un rol igual o superior al mío.`, { emoji: "error" }));
      if (!member.bannable)
        return message.reply(client.beautifyMessage(`No se puede banear a ${bold(member.user.tag)}.`, { emoji: "error" }));
    }

    try {
      await message.guild.members.ban(user.id, { reason, deleteMessageSeconds: 60 * 60 * 24 * 7 });
    } catch (error) {
      console.error(error);
      return message.channel.send(client.beautifyMessage("Hubo un error al intentar banear al usuario del servidor. Vuelve a intentar más tarde.", { emoji: "warning" }));
    }

    return message.reply(client.beautifyMessage(`${bold(user.tag)} (${inlineCode(user.id)}) fue baneado del servidor.\n${bold("Razón")}: ${reason}`, {
      emoji: "check"
    }));
  }
});
