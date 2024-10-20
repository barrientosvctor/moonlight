import { ChannelType, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "purge",
  cooldown: 5,
  category: "Moderación",
  description: "Borra una cantidad de mensajes en el chat",
  usage: "<número>",
  example: "20",
  requiredClientPermissions: ["ManageMessages"],
  requiredMemberPermissions: ["ManageMessages"],
  async run(client, message, args) {
    if (message.channel.type !== ChannelType.GuildText)
      return message.reply(
        client.beautifyMessage(
          "Solo puedo hacer esta acción con canales de texto.",
          { emoji: "error" }
        )
      );

    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Escribe el número de mensajes que vas a eliminar en este chat.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const numMessages = Number(args[1]);

    if (Number.isNaN(numMessages))
      return message.channel.send(
        client.beautifyMessage("Me tienes que dar un número.", {
          emoji: "error",
          mention: message.author.username
        })
      );
    if (Number.isInteger(args[1]))
      return message.reply(
        client.beautifyMessage(
          "La cantidad de mensajes a eliminar debe ser un número entero.",
          { emoji: "error" }
        )
      );

    if (numMessages < 1 || numMessages > 100)
      return message.reply(
        client.beautifyMessage(
          `Solo puedes eliminar entre ${bold("1")} y ${bold("100")} mensajes.`,
          { emoji: "error" }
        )
      );

    if (message.deletable) await message.delete();

    try {
      await message.channel.bulkDelete(numMessages, true);
    } catch (error) {
      console.error(error);
      return message.channel.send(
        client.beautifyMessage(
          "Ocurrió un error al intentar eliminar los mensajes.",
          { emoji: "warning" }
        )
      );
    }

    return message.channel
      .send(
        client.beautifyMessage(`${numMessages} mensajes eliminados.`, {
          emoji: "check"
        })
      )
      .then(msg =>
        setTimeout(() => {
          if (msg.deletable) msg.delete();
        }, 10000)
      );
  }
});
