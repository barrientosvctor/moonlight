import { bold, inlineCode } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
import { getMember } from "../../../util/functions.js";
import {
  HumanizeDuration,
  HumanizeDurationLanguage
} from "humanize-duration-ts";
import { toMs } from "ms-typescript";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "mute",
  cooldown: 5,
  category: "Moderación",
  description: "Mutea temporalmente a un miembro del servidor.",
  usage: "<@miembro | ID> <tiempo> [razón]",
  example: "@Neon 15m Mal comportamiento",
  requiredClientPermissions: ["ManageRoles"],
  requiredMemberPermissions: ["ManageRoles"],
  async run(client, message, args) {
    if (!message.inGuild() || !message.member) return;
    if (!client.database.has("muterole", message.guildId))
      return message.reply(
        client.beautifyMessage(
          `Para mutear a alguien, primero debes configurar un rol para mutear en el servidor, para ello usa ${inlineCode("!!muterole set")}.`,
          { emoji: "error" }
        )
      );

    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Menciona o escribe la ID del miembro que vas a mutear.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const humanizeService = new HumanizeDuration(
      new HumanizeDurationLanguage()
    );

    humanizeService.setOptions({
      language: "es"
    });

    const muteRoleID = client.database.get("muterole", message.guildId)!;
    const member = await getMember(args[1], message);
    if (!member)
      return message.reply(
        client.beautifyMessage(
          "Parece que este usuario no pertenece al servidor.",
          { emoji: "error" }
        )
      );
    if (
      !args[2] ||
      (args[2] !== `${parseInt(args[2].slice(0))}s` &&
        args[2] !== `${parseInt(args[2].slice(0))}m` &&
        args[2] !== `${parseInt(args[2].slice(0))}h` &&
        args[2] !== `${parseInt(args[2].slice(0))}d` &&
        args[2] !== `${parseInt(args[2].slice(0))}w` &&
        args[2] !== `${parseInt(args[2].slice(0))}y`)
    )
      return message.reply(
        client.beautifyMessage(
          "Escribe una duración válida. (10s / 5m / 1h / 2w / 1y)",
          { emoji: "error" }
        )
      );

    let reason = args.slice(3).join(" ");
    if (!reason) reason = "No hubo razón.";
    if (reason.length >= 511) reason = `${reason.slice(0, 508)}...`;

    if (member === message.member)
      return message.reply(
        client.beautifyMessage("No te puedes mutear a ti mismo.", {
          emoji: "error"
        })
      );
    if (member === message.guild.members.me)
      return message.reply(
        client.beautifyMessage(
          "No me puedes mutear del servidor con mis comandos.",
          { emoji: "error" }
        )
      );

    if (member.roles.highest.position >= message.member.roles.highest.position)
      return message.reply(
        client.beautifyMessage(
          `No puedes mutear a ${bold(member.user.tag)} porque tiene un rol jerárquicamente igual o superior al tuyo.`,
          { emoji: "error" }
        )
      );
    if (!member.manageable)
      return message.reply(
        client.beautifyMessage(
          `No logré mutear a ${bold(member.user.tag)} porque jerárquicamente tiene un rol igual o superior al mío.`,
          { emoji: "error" }
        )
      );
    if (member.roles.cache.has(muteRoleID))
      return message.reply(
        client.beautifyMessage(`${bold(member.user.tag)} ya estaba muteado.`, {
          emoji: "error"
        })
      );

    try {
      await member.roles.add(
        muteRoleID,
        `Mute hecho por: ${message.author.tag}. Razón: ${reason}`
      );
    } catch (error) {
      console.error(error);
      return message.channel.send(
        client.beautifyMessage(
          "Ocurrió un error al intentar mutear al usuario.",
          { emoji: "warning" }
        )
      );
    }

    const duration = humanizeService.humanize(toMs(args[2]));
    await message.reply(
      client.beautifyMessage(
        `${bold(member.user.tag)} (${inlineCode(member.user.id)}) fue muteado del servidor durante ${bold(duration)}.\nRazón: ${reason}`,
        { emoji: "check" }
      )
    );

    try {
      await member.user.send(
        `> ¡Fuiste muteado temporalmente de ${bold(message.guild.name)} por ${bold(message.author.tag)} durante ${bold(duration)}!\n${bold("Motivo")}: ${reason}`
      );
    } catch (error) {
      return message.channel.send(
        client.beautifyMessage(
          "No fue posible enviarle un mensaje privado avisándole sobre su mute, tal vez se deba a que tiene cerrado los mensajes privados.",
          { emoji: "warning" }
        )
      );
    }

    // TODO: optimize remove mute event
    setTimeout(async () => {
      try {
        await member.roles.remove(
          muteRoleID,
          "Periodo de eliminación automática del mute."
        );
      } catch (error) {
        console.error(
          `No pude quitar el rol de mute de ${member.user.tag} en el servidor ${message.guild.name}`
        );
      }
    }, toMs(args[2]));

    return;
  }
});
