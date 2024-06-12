import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
import { getRole } from "../../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "roleinfo",
  cooldown: 5,
  category: "Información",
  description:
    "Te da información sobre el rol que me digas, puedes mencionarlo o escribirme la ID del rol.",
  aliases: ["rinfo"],
  usage: "[@rol | <id>]",
  example: "@Moderator",
  run(client, message, args) {
    if (!args[1])
      return message.reply(
        client.beautifyMessage("Menciona o escribe la ID de un rol.", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );

    const role = getRole(args[1], message);

    if (!role)
      return message.reply(
        client.beautifyMessage("No se pudo encontrar ese rol.", {
          emoji: "error"
        })
      );

    const embed = new EmbedBuilder()
      .setColor(role.hexColor || "Random")
      .setTitle(`Información del rol @${role.name}`)
      .setDescription(
        `
      **Nombre:** ${role.name}
      **ID:** ${role.id}
      **Color:** ${role.hexColor}
      **Miembros con este rol:** ${role.members.size}
      **¿Separado?** ${role.hoist ? "Sí" : "No"}
      **¿Administrado?** ${role.managed ? "Sí" : "No"}
      **¿Mencionable?** ${role.mentionable ? "Sí" : "No"}
      **¿Editable?** ${role.editable ? "Sí" : "No"}
      **Fecha de creación:** <t:${Math.ceil(role.createdTimestamp / 1000)}>
      `
      )
      .addFields({
        name: "Permisos",
        value: role.permissions
          .toArray()
          .map(permission =>
            client.wrapper.get("guild.roles.permissions", permission)
          )
          .join(", ")
      });

    return message.reply({ embeds: [embed] });
  }
});
