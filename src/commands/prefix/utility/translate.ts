import { bold, hyperlink } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
const here = hyperlink(
  "aquí",
  "https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes"
);

export default new LegacyCommandBuilder({
  name: "translate",
  description: `Traduce un mensaje al idioma que gustes.\nPara conocer los códigos de lenguaje haz click ${here}`,
  cooldown: 10,
  usage: "<codigo de lenguaje> <texto>",
  example: "es Hello! I'm Moonlight",
  category: "Utilidad",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          `Escribe el código de idioma que quieres traducir el texto.\nPara conocer los códigos de idioma disponibles haz click ${here}.`,
          { mention: message.author.username, emoji: "noargs" }
        )
      );
    if (!client.wrapper.get("translate", args[1]))
      return message.reply(
        client.beautifyMessage(
          `Ese código de idioma no es válido!\nPara conocer los códigos de idioma disponibles haz click ${here}.`,
          { emoji: "error" }
        )
      );
    if (!args[2])
      return message.channel.send(
        client.beautifyMessage(
          `Escribe el texto que vas a traducir al idioma ${bold(client.wrapper.get("translate", args[1]))}.`,
          { mention: message.author.username, emoji: "noargs" }
        )
      );

    const data = await fetch(
      `https://api.popcat.xyz/translate?to=${args[1]}&text=${args.slice(2).join(" ")}`,
      { method: "GET" }
    ).then(res => res.json());

    return message.reply(
      `> Traducción al ${bold(client.wrapper.get("translate", args[1]))}: ${data.translated}`
    );
  }
});
