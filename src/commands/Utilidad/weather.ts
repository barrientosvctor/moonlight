import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "weather",
  description: "Checa el clima con este comando.",
  cooldown: 3,
  aliases: ["wth"],
  usage: "<ciudad | país>",
  example: "Texas",
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el nombre de un país o ciudad para obtener el pronóstico del clima.", { mention: msg.author.username, emoji: "noargs" }))
      const data = await fetch(`https://api.popcat.xyz/weather?q=${args.slice(1).join(' ').replace(' ', '%20')}`).then(res => res.json());
      if (!data) return msg.reply(bot.replyMessage("No se encontró esta ubicación.", { emoji: "error" }));

      const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
      .setTitle(`Ubicación: ${data[0].location.name}`)
      .setDescription(`
> __Pronóstico del clima__
**Ubicación:** ${data[0].location.name}
**Cielo:** ${data[0].current.skytext}
**Temperatura:** ${data[0].current.temperature}°${data[0].location.degreetype}
**Sensación térmica:** ${data[0].current.feelslike}°${data[0].location.degreetype}
**Humedad:** ${data[0].current.humidity}%
**Velocidad del viento:** ${data[0].current.winddisplay}

> __Otra información__
**Día:** ${data[0].current.day} (${data[0].current.shortday})
**Fecha y hora:** ${data[0].current.date} - ${data[0].current.observationtime}
**Zona horaria:** GMT${data[0].location.timezone}`)
      .setThumbnail(data[0].current.imageUrl);
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
