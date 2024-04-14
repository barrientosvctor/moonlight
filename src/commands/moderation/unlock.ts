import { ChannelType } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getChannel } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "unlock",
  cooldown: 5,
  category: "Moderación",
  description: "Le quita el bloqueo al canal mencionado.",
  usage: "[#canal | ID]",
  example: "#general",
  requiredClientPermissions: ["ManageChannels", "ManageRoles"],
  requiredMemberPermissions: ["ManageChannels"],
  async run(client, message, args) {
    if (!message.inGuild()) return;

    const channel = getChannel(args[1], message) || message.channel
    if (!channel)
      return message.reply(client.beautifyMessage("Parece que ese canal no pertenece al servidor.", { emoji: "error" }));
    if (channel.type !== ChannelType.GuildText)
      return message.reply(client.beautifyMessage("Solo puedo hacer esta acción con canales de texto.", { emoji: "error" }));
    if (channel.permissionsFor(message.guild.roles.everyone).has(["SendMessages", "AddReactions"]))
      return message.reply(client.beautifyMessage(`El canal ${channel} ya estaba desbloqueado.`, { emoji: "error" }));

    try {
      await channel.permissionOverwrites.edit(message.guild.roles.everyone, { "SendMessages": true, "AddReactions": true });
    } catch (error) {
      console.error(error);
      message.channel.send(client.beautifyMessage("Ocurrió un error al intentar desbloquear el canal.", { emoji: "warning" }));
    }

    return channel.send(client.beautifyMessage("El canal ha sido desbloqueado.", { emoji: "check" }));
  }
});
