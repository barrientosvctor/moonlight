import { EmbedBuilder, bold } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "help",
  cooldown: 5,
  category: "Información",
  description:
    "Revisa información importante sobre un comando o conoce todos los comandos que tengo disponibles.",
  aliases: ["h"],
  usage: "[comando]",
  example: "invite",
  async run(client, message, args) {
    const embed = new EmbedBuilder().setColor("Random");

    if (args[1]) {
      const commandInput = client.utils.receiveCommand(args[1]);
      const application = await client.application?.fetch();
      if (
        !commandInput ||
        (commandInput.ownerOnly &&
          application &&
          message.author.id !== application.owner?.id)
      )
        return message.reply(
          `No pude encontrar el comando ${bold(args[1])}. Revisa los comandos que tengo disponibles usando \`!!${this.name}\`.`
        );

      embed
        .setTitle(`Comando: ${commandInput.name}`)
        .addFields(
          {
            name: "Descripción",
            value: commandInput.description!
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
            value: commandInput.aliases?.length
              ? commandInput.aliases.join(", ")
              : "Ninguno",
            inline: true
          },
          {
            name: "Forma de uso",
            value: commandInput.usage
              ? `!!${commandInput.name} ${commandInput.usage}`
              : "No tiene uso especificado.",
            inline: true
          },
          {
            name: "Ejemplo de uso",
            value: commandInput.example
              ? `!!${commandInput.name} ${commandInput.example}`
              : "No tiene ejemplo especificado.",
            inline: true
          },
          {
            name: "Permisos necesarios del usuario",
            value: commandInput.requiredMemberPermissions?.length
              ? client.utils
                  .convertPermissionsToSpanish(
                    commandInput.requiredMemberPermissions
                  )
                  .join(", ")
              : "Ninguno"
          },
          {
            name: "Permisos necesarios de Moonlight",
            value: commandInput.requiredClientPermissions?.length
              ? client.utils
                  .convertPermissionsToSpanish(
                    commandInput.requiredClientPermissions
                  )
                  .join(", ")
              : "Ninguno"
          }
        )
        .setFooter({
          text: "Sintaxis: <requerido> [opcional] | = ó"
        });
    } else {
      embed
        .setTitle("Mis comandos")
        .setDescription(client.commandsManager.showCommandsList())
        .setFooter({
          text: `Para más información sobre un comando, usa: !!${this.name} <comando>`,
          iconURL: client.user?.displayAvatarURL({
            size: 2048,
            extension: "png"
          })
        });
    }

    return message.reply({ embeds: [embed] });
  }
});
