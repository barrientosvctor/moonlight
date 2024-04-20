import { bold, inlineCode } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getMember } from "../../util/functions.js";
import { HumanizeDuration, HumanizeDurationLanguage } from "humanize-duration-ts";
import { toMs } from "ms-typescript";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "tempban",
  cooldown: 5,
  category: "Moderación",
  description: "Banea temporalmente a un miembro del servidor.",
  usage: "<@miembro | ID> <tiempo> [razón]",
  example: "@Neon 5m noob",
  requiredClientPermissions: ["BanMembers"],
  requiredMemberPermissions: ["BanMembers"],
  async run(client, message, args) {
    if (!message.inGuild() || !message.member) return;
    const humanizeService = new HumanizeDuration(new HumanizeDurationLanguage());

    humanizeService.setOptions({
      language: "es"
    });

    if (!args[1]) return message.channel.send(client.beautifyMessage("menciona o escriba la ID del miembro que va a banear temporalmente del servidor.", { mention: message.author.username, emoji: "noargs" }));

    const member = getMember(args[1], message);
    if (!member) return message.reply(client.beautifyMessage("Este usuario no está en el servidor. Prueba con otro.", { emoji: "error" }));
    if (!args[2] || args[2] !== (`${parseInt(args[2].slice(0))}s`) && args[2] !== (`${parseInt(args[2].slice(0))}m`) && args[2] !== (`${parseInt(args[2].slice(0))}h`) && args[2] !== (`${parseInt(args[2].slice(0))}d`) && args[2] !== (`${parseInt(args[2].slice(0))}w`) && args[2] !== (`${parseInt(args[2].slice(0))}y`))
    return message.reply(client.beautifyMessage("Escribe una duración válida. (10s/5m/1h/2w/1y)", { emoji: "error" }));

    let reason = args.slice(3).join(" ");
    if (!reason) reason = "No hubo motivo.";
    if (reason.length >= 511) reason = `${reason.slice(0, 508)}...`;

    if (member === message.member) return message.reply(client.beautifyMessage("No te puedes banear a ti mismo, prueba con otro.", { emoji: "error" }));
    if (member === message.guild.members.me) return message.reply(client.beautifyMessage("¿Por qué yo?", { emoji: "error" }));
    if (member.roles.highest.position >= message.member.roles.highest.position) return message.reply(client.beautifyMessage("No puedes banear a este miembro debido a que cuenta con un rol igual o superior al tuyo.", { emoji: "error" }));
    if (!member.manageable) return message.reply(client.beautifyMessage(`No puedo banear a ${member.user.tag} ya que tiene un rol igual o superior al mío.`, { emoji: "error" }));
    if (!member.bannable) return message.reply(client.beautifyMessage(`No se puede banear a ${member.user.tag}`, { emoji: "error" }));

    try {
      await member.ban({ reason, deleteMessageSeconds: 60 * 60 * 24 * 7 });
    } catch (error) {
      console.error(error);
      return message.channel.send(client.beautifyMessage("Hubo un error al intentar banear al usuario del servidor.", { emoji: "warning" }));
    }

    const humanDuration = humanizeService.humanize(toMs(args[2]));

    try {
      await member.user.send(`> ¡Fuiste baneado temporalmente de ${bold(message.guild.name)} por ${bold(message.author.tag)} durante ${bold(humanDuration)}!\nMotivo: ${reason}`);
    } catch (error) {
      console.error("No message was sent to the banned user.");
    }

    message.reply(client.beautifyMessage(`${bold(member.user.tag)} (${inlineCode(member.user.id)}) fue baneado temporalmente del servidor durante ${bold(humanDuration)}.\n> Motivo: ${reason}`, { emoji: "check" }));

    setTimeout(async () => {
      try {
        await message.guild.members.unban(member.user.id);
      } catch (error) {
        console.error(error);
      }
    }, toMs(args[2]));

    return;
  }
});
