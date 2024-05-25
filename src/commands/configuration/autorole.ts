import { bold, inlineCode, roleMention } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getRole } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "autorole",
  cooldown: 10,
  category: "Configuración",
  description:
    "Establece un rol a los nuevos usuarios o bots que entren al servidor.",
  usage: "<set / delete / list> <user / bot> <@rol | ID>",
  example: "set user @Usuarios",
  requiredMemberPermissions: ["ManageRoles"],
  requiredClientPermissions: ["ManageRoles"],
  async run(client, message, args) {
    if (!message.inGuild() || !message.member) return;
    if (!args[1])
      return message.reply(
        client.beautifyMessage(
          "Escribe una de las siguientes opciones: `set`, `delete` ó `list`.",
          { emoji: "noargs" }
        )
      );

    if (args[1] === "set") {
      if (!["user", "bot"].includes(args[2]))
        return message.reply(
          client.beautifyMessage("Elige `user` ó `bot`.", { emoji: "noargs" })
        );
      const key = `${args[2]}-${message.guildId}`;

      const role = getRole(args[3], message);
      if (!role)
        return message.reply(
          client.beautifyMessage("Este rol no existe, prueba con otro.", {
            emoji: "error"
          })
        );
      if (role.position >= message.guild.members.me?.roles.highest.position!)
        return message.reply(
          client.beautifyMessage(
            "No puedo añadir este rol debido a que jerárquicamente tiene un puesto mayor o igual al mío.",
            { emoji: "error" }
          )
        );
      if (role.position >= message.member.roles.highest.position)
        return message.reply(
          client.beautifyMessage(
            "No puedes añadir el rol ya que jerárquicamente tiene un puesto mayor o igual al tuyo!",
            { emoji: "error" }
          )
        );
      if (role.managed)
        return message.reply(
          client.beautifyMessage(
            "No puedo asignar roles que estén administrados por una integración, prueba con otro.",
            { emoji: "warning" }
          )
        );

      if (
        client.database.has("autorole", key) &&
        client.database.get("autorole", key) === role.id
      )
        return message.reply(
          client.beautifyMessage(
            `Este rol ya ha sido establecido anteriormente para los ${args[2] === "user" ? "usuarios" : "bots"}, prueba con otro.`,
            { emoji: "warning" }
          )
        );

      if (client.database.has("autorole", key))
        await client.database.modify("autorole", key, role.id);
      else await client.database.add("autorole", key, role.id);

      return message.reply(
        client.beautifyMessage(
          `A partir de ahora, éste rol será asignado a todos los ${args[2] === "user" ? "usuarios" : "bots"} que entren al servidor.`,
          { emoji: "check" }
        )
      );
    } else if (args[1] === "delete") {
      if (!["user", "bot"].includes(args[2]))
        return message.reply(
          client.beautifyMessage("Elige `user` ó `bot`.", { emoji: "noargs" })
        );
      const key = `${args[2]}-${message.guildId}`;

      if (!client.database.has("autorole", key))
        return message.reply(
          client.beautifyMessage(
            `No hay ningún rol para eliminar. Para añadir uno, usa el comando: ${inlineCode(`!!${this.name} set ${args[2]} @rol`)}`,
            { emoji: "error" }
          )
        );

      await client.database.delete("autorole", key);

      return message.reply(
        client.beautifyMessage("Rol eliminado de la lista éxitosamente.", {
          emoji: "check"
        })
      );
    } else if (args[1] == "list") {
      const list = [];
      if (client.database.has("autorole", `user-${message.guildId}`))
        list.push(
          `- ${bold("Usuarios")}: ${roleMention(client.database.get("autorole", `user-${message.guildId}`)!)}`
        );

      if (client.database.has("autorole", `bot-${message.guildId}`))
        list.push(
          `- ${bold("Bots")}: ${roleMention(client.database.get("autorole", `bot-${message.guildId}`)!)}`
        );

      if (list.length === 0)
        return message.reply(
          client.beautifyMessage(
            "No hay roles establecidos para mostrar acá.",
            { emoji: "error" }
          )
        );

      return message.reply(`# Lista de autoroles

${list.join("\n")}`);
    } else
      return message.reply(
        client.beautifyMessage(
          "Opción no válida. Elige alguna de las opciones: `set`, `delete` ó `list`.",
          { emoji: "error" }
        )
      );
  }
});
