import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "help",
  cooldown: 5,
  category: "Información",
  description: "Revisa información importante sobre un comando o conoce todos los comandos que tengo disponibles.",
  aliases: ["h"],
  usage: "[comando]",
  example: "invite",
  run(client, message, args) {
    let embed = new EmbedBuilder()
      .setColor("Random");

    if (args[1]) {
      const commandInput = client.receiveCommand(args[1]);
      if (!commandInput || commandInput.ownerOnly)
        return message.reply(`No pude encontrar el comando ${bold(args[1])}. Revisa los comandos que tengo disponibles usando \`!!${this.name}\`.`);

      embed
        .setTitle(`Comando: ${commandInput.name}`)
        .addFields(
          {
            name: "Descripción",
            value: commandInput.description!,
          },
          {
            name: "Categoría",
            value: commandInput.category,
            inline: true
          },
          {
            name: "Tiempo de espera",
            value: `${commandInput.cooldown} segundos`,
            inline: true
          },
          {
            name: "Alias",
            value: commandInput.aliases?.length ? commandInput.aliases.join(", ") : "Ninguno",
            inline: true
          },
          {
            name: "Forma de uso",
            value: commandInput.usage ? `!!${commandInput.name} ${commandInput.usage}` : "No tiene uso especificado.",
            inline: true
          },
          {
            name: "Ejemplo de uso",
            value: commandInput.example ? `!!${commandInput.name} ${commandInput.example}` : "No tiene ejemplo especificado.",
            inline: true
          },
          {
            name: "Permisos necesarios del usuario",
            value: commandInput.requiredMemberPermissions?.toString().length ? client.convertPermissionStringToArray(commandInput.requiredMemberPermissions.toString()).join(", ") : "Ninguno"
          },
          {
            name: "Permisos necesarios de Moonlight",
            value: commandInput.requiredClientPermissions?.toString().length ? client.convertPermissionStringToArray(commandInput.requiredClientPermissions.toString()).join(", ") : "Ninguno"
          }
        )
        .setFooter({
          text: "Sintaxis: <requerido> [opcional] | = ó",
        });
    } else {
      embed
        .setTitle("Mis comandos")
        .setDescription(
          client.commandsManager.showCommandsList()
        )
        .setFooter({
          text: `Para más información sobre un comando, usa: !!${this.name} <comando>`,
          iconURL: client.user?.displayAvatarURL({ size: 2048, extension: "png" })
        });
    }

    return message.reply({ embeds: [embed] });
  }
});
