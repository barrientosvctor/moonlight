import { bold, inlineCode } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getUser } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "unban",
  cooldown: 5,
  category: "Moderación",
  description: "Le quita el ban a un usuario de tu servidor.",
  usage: "<@usuario | ID>",
  example: "112233445566778899",
  requiredClientPermissions: ["BanMembers"],
  requiredMemberPermissions: ["BanMembers"],
  async run(client, message, args) {
    if (!message.inGuild()) return;
    if (!args[1])
      return message.channel.send(client.beautifyMessage("escriba la ID del usuario para quitarle su ban.", { mention: message.author.username, emoji: "noargs" }));

    const user = await getUser(args[1], client);
    if (!user) return message.reply(client.beautifyMessage("Este usuario no existe. Prueba con otro.", { emoji: "error" }));

    if (user === message.author) return message.reply(client.beautifyMessage("No puedes quitarte el ban a ti mismo.", { emoji: "error" }));
    if (user === message.guild.members.me?.user) return message.reply(client.beautifyMessage("Sigo aquí.", { emoji: "error" }));

    try {
      await message.guild.members.unban(user.id, `Usuario desbaneado por: ${message.author.tag}`);
    } catch (error) {
      console.error(error);
      return message.reply(client.beautifyMessage("Este usuario no estaba baneado.", { emoji: "error" }));
    }

    return message.reply(client.beautifyMessage(`${bold(user.tag)} (${inlineCode(user.id)}) acaba de ser eliminado de la lista de baneos del servidor.`, { emoji: "check" }));
  }
});
