import { bold, time } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "jumbo",
  description:
    "Obten la imagen de un emoji del servidor, añadido también con información sobre este.",
  cooldown: 10,
  usage: "<:emoji:>",
  example: ":RappiHappu:",
  category: "Utilidad",
  async run(client, message, args) {
    if (!message.inGuild()) return;
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("Debes poner un emoji", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );

    const emoji = message.guild.emojis.cache.find(
      emoji => emoji.name === args[1].split(":")[1]
    );
    if (!emoji)
      return message.reply(
        client.beautifyMessage("Ese emoji no se encontró en este servidor.", {
          emoji: "error"
        })
      );

    return message.reply(`
> ${bold("Nombre")}: \`${emoji.name}\`
> ${bold("ID")}: \`${emoji.id}\`
> ${bold("Identificador")}: \`${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`}\`
> ${bold("Fecha de creación")}: ${time(Math.ceil(emoji.createdTimestamp / 1000))}
> ${bold("URL")}: ${emoji.imageURL({ size: 2048, extension: emoji.animated ? "gif" : "png" })}`);
  }
});
