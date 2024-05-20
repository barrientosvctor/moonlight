import { bold, inlineCode } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getMember } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "unmute",
  cooldown: 5,
  category: "Moderación",
  description: "Desmutea a un miembro del servidor.",
  usage: "<@miembro | ID>",
  example: "@Neon",
  requiredClientPermissions: ["ManageRoles"],
  requiredMemberPermissions: ["ManageRoles"],
  async run(client, message, args) {
    if (!message.inGuild() || !message.member) return;
    if (!client.database.has("muterole", message.guildId))
      return message.reply(
        client.beautifyMessage(
          `Para quitar el mute a alguien, primero debes configurar un rol para mutear en el servidor, para ello usa ${inlineCode("!!muterole set")}.`,
          { emoji: "error" }
        )
      );

    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Menciona o escribe la ID del miembro a desmutear.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const muteRoleID = client.database.get("muterole", message.guildId)!;
    const member = getMember(args[1], message);
    if (!member)
      return message.reply(
        client.beautifyMessage(
          "Parece que este usuario no pertenece al servidor.",
          { emoji: "error" }
        )
      );

    if (member === message.member)
      return message.reply(
        client.beautifyMessage("No te puedes desmutear a ti mismo.", {
          emoji: "error"
        })
      );
    if (member === message.guild.members.me)
      return message.reply(
        client.beautifyMessage("Sigo aquí.", { emoji: "error" })
      );

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply(
        client.beautifyMessage(
          `No puedes desmutear a ${bold(member.user.tag)} debido a que tiene un rol jerárquicamente igual o superior al tuyo.`,
          { emoji: "error" }
        )
      );
    if (!member.manageable)
      return message.reply(
        client.beautifyMessage(
          `No logré desmutear a ${bold(member.user.tag)} debido a que jerárquicamente tiene un rol igual o superior al mío.`,
          { emoji: "error" }
        )
      );
    if (!member.roles.cache.has(muteRoleID))
      return message.reply(
        client.beautifyMessage(`${member.user.tag} no estaba muteado.`, {
          emoji: "error"
        })
      );

    try {
      await member.roles.remove(
        muteRoleID,
        `Usuario desmuteado por: ${message.author.tag}.`
      );
    } catch (error) {
      console.error(error);
      return message.channel.send(
        client.beautifyMessage(
          "Ocurrió un error al intentar desmutear a este usuario.",
          { emoji: "warning" }
        )
      );
    }

    await message.reply(
      client.beautifyMessage(
        `${bold(member.user.tag)} (${inlineCode(member.user.id)}) fue desmuteado del servidor.`,
        { emoji: "check" }
      )
    );

    try {
      await member.user.send(
        `> ¡Acabas de ser desmuteado de ${bold(message.guild.name)} por ${bold(message.author.tag)}!`
      );
    } catch (error) {
      return message.channel.send(
        client.beautifyMessage(
          "No fue posible enviarle un mensaje privado avisándole sobre su desmuteo, tal vez se deba a que tiene cerrado los mensajes privados.",
          { emoji: "warning" }
        )
      );
    }

    return;
  }
});
