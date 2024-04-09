import { bold, inlineCode } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getMember } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "ban",
  cooldown: 5,
  category: "Moderación",
  description: "Banea de su servidor a cualquier miembro.",
  usage: "<@miembro | ID> [razón]",
  example: "@Neon noob",
  requiredClientPermissions: ["BanMembers"],
  requiredMemberPermissions: ["BanMembers"],
  async run(client, message, args) {
    if (!message.inGuild()) return;
    if (!args[1])
      return message.channel.send(client.beautifyMessage("Menciona o escriba la ID del miembro que va a banear del servidor.", { mention: message.author.username, emoji: "noargs" }));

    const member = getMember(args[1], message);
    if (!member)
      return message.reply(client.beautifyMessage("Este usuario no está en el servidor. Prueba con otro.", { emoji: "error" }));

    let reason = args.slice(2).join(" ");
    if (!reason) reason = "No se dio razón.";
    if (reason.length >= 511) reason = `${reason.slice(0, 508)}...`;

    if (member === message.member)
      return message.reply(client.beautifyMessage("No te puedes banear a ti mismo, prueba con otro.", { emoji: "error" }));
    if (member === message.guild.members.me)
      return message.reply("¿Por qué yo?");
    if (member.roles.highest.position >= message.member!.roles.highest.position)
      return message.reply(client.beautifyMessage("No puedes banear a este miembro debido a que cuenta con un rol igual o superior al tuyo.", { emoji: "error" }));
    if (!member.manageable)
      return message.reply(client.beautifyMessage(`No puedo banear a ${bold(member.user.tag)} ya que tiene un rol igual o superior al mío.`, { emoji: "error" }));
    if (!member.bannable)
      return message.reply(client.beautifyMessage(`No se puede banear a ${bold(member.user.tag)}.`, { emoji: "error" }));

    try {
      await member.ban({ reason });
    } catch (error) {
      console.error(error);
      return message.channel.send(client.beautifyMessage("Hubo un error al intentar banear al usuario del servidor. Vuelve a intentar más tarde.", { emoji: "warning" }));
    }

    if (!member.user.bot)
      await member.user.send(`> ¡Has sido baneado de ${bold(message.guild.name)} por ${bold(message.author.tag)}!\n${bold("Razón")}: ${reason}`)
        .catch(() => { });

    return message.reply(client.beautifyMessage(`He baneado a ${member.user.tag} (${inlineCode(member.user.id)}) del servidor.\n${bold("Razón")}: ${reason}`, {
      emoji: "check"
    }));
  }
});
