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
  usage: "!!help [comando]",
  example: "!!help invite",
  run(client, message, args) {
    let embed = new EmbedBuilder()
    .setColor("Random")
    .setTimestamp();

    if (args[1]) {
      const commandInput = client.commandsManager.getCommand(args[1], CommandType.Legacy);
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
            value: commandInput.usage!,
            inline: true
          },
          {
            name: "Ejemplo de uso",
            value: commandInput.example!,
            inline: true
          },
          {
            name: "Permisos necesarios del usuario",
            value: commandInput.requiredMemberPermissions?.toString().length ? commandInput.requiredMemberPermissions.toString() : "Ninguno"
          },
          {
            name: "Permisos necesarios de Moonlight",
            value: commandInput.requiredClientPermissions?.toString().length ? commandInput.requiredClientPermissions.toString() : "Ninguno"
          }
        );
    } else {
      embed
        .setTitle("Mis comandos")
        .setDescription(
          client.commandsManager.showCommandsList()
        )
    }

    return message.reply({ embeds: [embed] });
  }
});
