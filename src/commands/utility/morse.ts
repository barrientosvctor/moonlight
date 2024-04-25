import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "morse",
  description: "Convierte texto a código morse.",
  cooldown: 10,
  usage: "<texto>",
  example: "Hola que tal",
  category: "Utilidad",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Escribe el texto que vas a convertir en código morse.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const data = await fetch(
      `https://api.popcat.xyz/texttomorse?text=${encodeURIComponent(args.slice(1).join(" "))}`,
      { method: "GET" }
    ).then(res => res.json());
    if (data.error)
      return message.channel.send(
        client.beautifyMessage(
          "Hubo un error externo al intentar convertir el texto.",
          { emoji: "error" }
        )
      );

    return message.reply(`${data.morse}`);
  }
});
