import { TextChannel } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "unlock",
  description: "Le quita el bloqueo al canal mencionado.",
  cooldown: 3,
  usage: "[#canal | ID]",
  example: "#General",
  enabled: true,
  memberPerms: ["ManageChannels"],
  botPerms: ["ManageRoles", "ManageChannels"],
  async run(bot, msg, args, prefix, getUser, getMember, getChannel) {
    try {
      const channel = getChannel(args[1]) || msg.channel
      if (!channel) return msg.reply(bot.replyMessage("Parece que ese canal no pertenece al servidor.", { emoji: "error" }));
      if (channel instanceof TextChannel) {
        if (channel.permissionsFor(msg.guild.roles.everyone).has(["SendMessages", "AddReactions"])) return msg.reply(bot.replyMessage(`El canal ${channel} no estaba bloqueado.`, { emoji: "error" }));

        await channel.permissionOverwrites.edit(msg.guild.roles.everyone, { "SendMessages": true, "AddReactions": true }).then(() => {
          return channel.send(bot.replyMessage("El canal ha sido desbloqueado.", { emoji: "check" }));
        }).catch(err => {
          console.error(err);
          msg.channel.send(bot.replyMessage("Ocurrió un error al intentar desbloquear el canal", { emoji: "warning" }));
        });
      } else return msg.reply(bot.replyMessage("Solo puedo hacer esta acción con canales de texto.", { emoji: "error" }));
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
