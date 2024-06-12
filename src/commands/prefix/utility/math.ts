import { bold } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "math",
  description: "Una calculadora científica.",
  cooldown: 10,
  aliases: ["calc"],
  usage: "<operación>",
  example: "2+3*sqrt(4)",
  category: "Utilidad",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "Escribe la operación matemática que necesitas resolver.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );
    const data = await fetch(
      `https://api.mathjs.org/v4/?expr=${args.slice(1).join(" ").replace(`+`, `%2B`).replace(`^`, `%5E`).replace(`/`, `%2F`)}`
    );
    const text = await data.text();

    return message.reply(`> ${bold("Resultado")}: ${text}`);
  }
});
