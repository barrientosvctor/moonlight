import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "mdn",
  description: "Muestra información de la documentación de Mozilla Developer Network.",
  cooldown: 3,
  usage: "<busqueda>",
  example: "Array.prototype.map()",
  enabled: true,
  ownerOnly: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe lo que quieres buscar en la documentación.", { mention: msg.author.username, emoji: "noargs" }));

      const data = await fetch(`https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(args.slice(1).join(" "))}&locale=es`).then(res => res.json());
      let message: Array<string> = [];

      for (const doc of data.documents) {
        message.push(`> [${doc.title}](https://developer.mozilla.org${doc.mdn_url})`);
      }

      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setDescription(message.join("\n"))
      .setTitle(`Resultados con: ${args[1]}`);
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.error("Hubo un error al intentar obtener los datos de la documentación.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
