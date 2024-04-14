import { bold, inlineCode } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getMember } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "kick",
  cooldown: 5,
  category: "Moderación",
  description: "Expulsa a un miembro de su servidor.",
  usage: "<@miembro | ID> [razón]",
  example: "@Neon noob",
  requiredClientPermissions: ["KickMembers"],
  requiredMemberPermissions: ["KickMembers"],
  async run(client, message, args) {
    if (!message.inGuild()) return;
    if (!args[1])
      return message.channel.send(client.beautifyMessage("Menciona o escriba la ID de algún miembro.", { mention: message.author.username, emoji: "noargs" }));

    const member = getMember(args[1], message);
    if (!member)
      return message.reply(client.beautifyMessage("Este usuario no está en el servidor. Prueba con otro.", { emoji: "error" }));

    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No hubo razón.";
    if (reason.length >= 511) reason = `${reason.slice(0, 508)}...`;

    if (member === message.member)
      return message.reply(client.beautifyMessage("No te puedes expulsar a ti mismo, prueba con otro.", { emoji: "error" }));
      if (member === message.guild.members.me)
        return message.reply(client.beautifyMessage("¿Por qué yo?", { emoji: "error" }));
      if (member.roles.highest.position >= message.member!.roles.highest?.position)
        return message.reply(client.beautifyMessage(`No puedes expulsar a ${bold(member.user.tag)} debido a que cuenta con un rol igual o superior al tuyo.`, { emoji: "error" }));
      if (!member.manageable)
        return message.reply(client.beautifyMessage(`No puedo expulsar a ${bold(member.user.tag)} ya que tiene un rol igual o superior al mío.`, { emoji: "error" }));
      if (!member.kickable)
        return message.reply(client.beautifyMessage(`Es imposible expulsar a ${bold(member.user.tag)}.`, { emoji: "error" }));

    try {
      await member.kick(reason);
    } catch (error) {
      console.error(error);
      return message.channel.send(client.beautifyMessage("Hubo un error al intentar expulsar al usuario del servidor. Vuelve a intentar más tarde.", { emoji: "warning" }));
    }

    return message.reply(client.beautifyMessage(`${bold(member.user.tag)} (${inlineCode(member.user.id)}) fue expulsado del servidor.\n${bold("Razón")}: ${reason}`, {
      emoji: "check"
    }));
  }
});
