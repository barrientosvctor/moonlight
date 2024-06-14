import { EmbedBuilder, bold } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "emoji",
  description: "Administra los emojis de tu servidor.",
  cooldown: 10,
  usage: "<add / remove / rename> <emoji>",
  example: "rename :RappiHappu: Happy",
  category: "Utilidad",
  async run(client, message, args) {
    if (!message.inGuild()) return;

    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Escriba alguna de las siguientes opciones:\n`add`: Añade un nuevo emoji a su servidor.\n`remove`: Elimina un emoji de su servidor.\n`rename`: Renombra un emoji del servidor.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const embed = new EmbedBuilder();

    if (args[1] === "add") {
      if (!args[2])
        return message.channel.send(
          client.beautifyMessage(
            "Escribe el nombre del emoji que vas a añadir.",
            { mention: message.author.username, emoji: "noargs" }
          )
        );
      if (!message.attachments.size)
        return message.reply(
          client.beautifyMessage(
            "Adjunta al mensaje el archivo del emoji que vas a añadir al servidor.",
            { emoji: "error" }
          )
        );
      if (message.attachments.size > 1)
        return message.reply(
          client.beautifyMessage("Solo puedes añadir un emoji por comando.", {
            emoji: "error"
          })
        );

      try {
        const emoji = await message.guild.emojis.create({
          name: args[2],
          attachment: message.attachments.first()!.proxyURL,
          reason: `Emoji añadido por: ${bold(message.author.tag)}.`
        });

        embed
          .setColor("Green")
          .setDescription(
            `${client.getEmoji("check")} Muy bien! El emoji ${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`} fue añadido correctamente al servidor.\n\n**Nombre:** ${emoji.name}\n**ID:** ${emoji.id}\n**¿Animado?** ${emoji.animated ? `Sí.` : `No.`}\n**Añadido por:** ${message.author}`
          )
          .setImage(emoji.imageURL());
      } catch (error) {
        console.error(error);
        return message.channel.send(
          `Hubo un error al intentar añadir el emoji al servidor.`
        );
      }
    } else if (args[1] === "remove") {
      if (!args[2])
        return message.channel.send(
          client.beautifyMessage(
            "escribe el nombre del emoji que vas a eliminar del servidor.",
            { mention: message.author.username, emoji: "noargs" }
          )
        );

      const targetEmoji =
        message.guild.emojis.cache.find(emoji => emoji.name === args[2]) ||
        message.guild.emojis.cache.find(
          emoji => emoji.name === args[2].split(":")[1]
        );
      if (!targetEmoji)
        return message.reply(
          client.beautifyMessage(
            `El emoji ${bold(args[2])} no existe en el servidor, asegurate de escribir bien su nombre.`,
            { emoji: "error" }
          )
        );

      if (!targetEmoji.deletable)
        return message.reply(
          client.beautifyMessage(
            "Este emoji no se puede eliminar, intenta con otro.",
            { emoji: "error" }
          )
        );

      try {
        await targetEmoji.delete(`Emoji eliminado por: ${message.author.tag}`);

        embed
          .setDescription(
            `${client.beautifyMessage(`Se eliminó el emoji del servidor.`, { emoji: "check" })}`
          )
          .setColor("Green");
      } catch (error) {
        console.error(error);
        return message.reply(
          client.beautifyMessage(
            "Hubo un error al intentar eliminar el emoji del servidor. Prueba más tarde.",
            { emoji: "warning" }
          )
        );
      }
    } else if (args[1] === "rename") {
      if (!args[2])
        return message.channel.send(
          client.beautifyMessage(
            "Escribe el nombre del emoji que va a ser cambiado de nombre.",
            { mention: message.author.username, emoji: "noargs" }
          )
        );
      const targetEmoji =
        message.guild.emojis.cache.find(emoji => emoji.name === args[2]) ||
        message.guild.emojis.cache.find(
          emoji => emoji.name === args[2].split(":")[1]
        );
      if (!targetEmoji)
        return message.reply(
          client.beautifyMessage(
            `El emoji ${bold(args[2])} no existe en el servidor, asegurate de escribir bien su nombre.`,
            { emoji: "error" }
          )
        );
      if (!args[3])
        return message.channel.send(
          client.beautifyMessage(
            `Escribe el nuevo nombre que tendrá el emoji.`,
            { mention: message.author.username, emoji: "noargs" }
          )
        );

      try {
        await targetEmoji.edit({
          name: args[3],
          reason: `Emoji modificado por: ${bold(message.author.tag)}.`
        });
        embed
          .setDescription(
            `${client.beautifyMessage("Emoji cambiado de nombre éxitosamente!", { emoji: "check" })}`
          )
          .setColor("Green");
      } catch (error) {
        console.error(error);
        return message.channel.send(
          client.beautifyMessage(
            "hubo un error al intentar modificar el emoji.",
            { mention: message.author.username, emoji: "warning" }
          )
        );
      }
    } else
      return message.reply(
        client.beautifyMessage("Opción no válida.", { emoji: "error" })
      );

    return message.reply({ embeds: [embed] });
  }
});
