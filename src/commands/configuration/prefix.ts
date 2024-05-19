import { bold } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "prefix",
  cooldown: 10,
  category: "Configuración",
  description: "Cambia el prefix del su servidor.",
  usage: "<set / reset> <prefix>",
  example: "set mm!",
  requiredMemberPermissions: ["ManageGuild"],
  async run(client, message, args) {
    if (!message.inGuild()) return;
    if (!args[1])
      return message.reply(
        client.beautifyMessage(
          "Escribe alguna de las opciones para seguir: `set` ó `reset`",
          { emoji: "noargs" }
        )
      );

    if (args[1] === "set") {
      if (!args[2])
        return message.reply(
          client.beautifyMessage(
            "Escribe el nuevo prefix que tendré en el servidor.",
            { emoji: "noargs" }
          )
        );
      if (args[2].length > 10)
        return message.reply(
          client.beautifyMessage(
            "El prefix no debe sobrepasar los 10 carácteres.",
            { emoji: "error" }
          )
        );

      if (client.database.has("prefix", message.guildId)) {
        await client.database.modify("prefix", message.guildId, args[2]);
      } else {
        await client.database.add("prefix", message.guildId, args[2]);
      }

      return message.reply(
        client.beautifyMessage(`El prefix ahora es: ${bold(args[2])}`, {
          emoji: "check"
        })
      );
    } else if (args[1] === "reset") {
      if (client.database.has("prefix", message.guildId)) {
        await client.database.delete("prefix", message.guildId);
      } else
        return message.reply(
          client.beautifyMessage(
            "No tenía un prefix establecido anteriormente en el servidor.",
            { emoji: "error" }
          )
        );

      return message.reply(
        client.beautifyMessage(
          `El prefix fue reiniciado. Ahora es: ${bold("!!")}`,
          { emoji: "check" }
        )
      );
    } else
      return message.reply(
        client.beautifyMessage(
          "Opción no válida. Las opciones disponibles son las siguientes: `set` ó `reset`",
          { emoji: "error" }
        )
      );
  }
});
