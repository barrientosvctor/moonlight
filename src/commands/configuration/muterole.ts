import { inlineCode, roleMention } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getRole } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "muterole",
  cooldown: 10,
  category: "Configuración",
  description: "Configura el rol para mutear a los usuarios de su servidor.",
  usage: "<set / delete / list> <@rol>",
  example: "set @Muted",
  requiredMemberPermissions: ["ManageGuild"],
  async run(client, message, args) {
    if (!message.inGuild()) return;
    if (!args[1]) return message.reply(client.beautifyMessage("Escribe alguna de las opciones para seguir: `set`, `delete` ó `list`", { emoji: "noargs" }));

    if (args[1] === "set") {
      if (!args[2]) return message.reply(client.beautifyMessage("Menciona o escribe la ID del rol que usarás para mutear a los usuarios.", { emoji: "noargs" }));

      const role = getRole(args[2], message);

      if (!role) return message.reply(client.beautifyMessage("No se encontró este rol.", { emoji: "error" }));

      if (client.database.has("muterole", message.guildId)) {
        await client.database.modify("muterole", message.guildId, role.id);
      } else {
        await client.database.add("muterole", message.guildId, role.id);
      }

      return message.reply(client.beautifyMessage("Rol establecido éxitosamente.", { emoji: "check" }));
    } else if (args[1] === "delete") {
      if (client.database.has("muterole", message.guildId)) {
        await client.database.delete("muterole", message.guildId);
      } else return message.reply(client.beautifyMessage("No tenía establecido anteriormente un rol para ello.", { emoji: "error" }));

      return message.reply(client.beautifyMessage("Rol eliminado éxitosamente.", { emoji: "check" }));
    } else if (args[1] === "list") {
      if (!client.database.has("muterole", message.guildId))
        return message.reply(client.beautifyMessage(`No hay roles para mostrar. Para establecer uno usa ${inlineCode(`!!${this.name} set <@rol>`)}`, { emoji: "error" }));

      const roleId = client.database.get("muterole", message.guildId)!;

      return message.reply(`
# Rol para mutear
- ${roleMention(roleId)} (${inlineCode(roleId)})`);
    } else return message.reply(client.beautifyMessage("Opción no válida. Las opciones disponibles son las siguientes: `set`, `delete` ó `list`", { emoji: "error" }));
  }
});
