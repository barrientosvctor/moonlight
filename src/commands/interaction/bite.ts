import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { fetchAnimeGIF, getMember } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "bite",
  description: "Muerde a algún usuario con este comando.",
  cooldown: 3,
  usage: "<@usuario | ID>",
  example: "@darz",
  category: "Interacción",
  async run(client, message, args) {
    if (!args[1]) return message.channel.send(client.beautifyMessage("menciona a la persona que vas a morder.", { mention: message.author.username, emoji: "noargs" }));

    const member = getMember(args[1], message);

    if (!member) return message.reply(client.beautifyMessage("Este usuario no está en el servidor.", { emoji: "error" }));
    if (member.user.id === message.author.id) return message.channel.send(client.beautifyMessage("¿por qué te morderías a ti mismo?", { mention: message.author.username }));
    if (member.user.id === client.user?.id) return message.channel.send(client.beautifyMessage("¡No me gusta que me muerdan, prueba con otro!", { mention: message.author.username }));

    const data = await fetchAnimeGIF("bite"),
      embed = new EmbedBuilder()
        .setDescription(`**${message.author.username}** modió a **${member.user.username}**`)
        .setColor("DarkGrey")
        .setImage(data.url);

    return message.channel.send({ embeds: [embed] });
  }
});
