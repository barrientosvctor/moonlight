import { EmbedBuilder, bold, underscore } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "weather",
  description: "Obtén información sobre el clima de algún país.",
  cooldown: 10,
  usage: "<ciudad | pais>",
  example: "Texas",
  category: "Utilidad",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage(
          "escribe el nombre de un país o ciudad para obtener el pronóstico del clima.",
          { mention: message.author.username, emoji: "noargs" }
        )
      );
    const data = await fetch(
      `https://api.popcat.xyz/weather?q=${encodeURIComponent(args.slice(1).join(" "))}`
    ).then(res => res.json());
    if (!data)
      return message.reply(
        client.beautifyMessage("No encontré esta ubicación.", {
          emoji: "error"
        })
      );

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${data[0].location.name}`)
      .setDescription(
        `
> ${underscore("Pronóstico del clima")}
${bold("Cielo")}: ${data[0].current.skytext}
${bold("Temperatura")}: ${data[0].current.temperature}°${data[0].location.degreetype}
${bold("Sensación térmica")}: ${data[0].current.feelslike}°${data[0].location.degreetype}
${bold("Humedad")}: ${data[0].current.humidity}%
${bold("Velocidad del viento")}: ${data[0].current.winddisplay}

> ${underscore("Otra información")}
${bold("Día")}: ${data[0].current.day} (${data[0].current.shortday})
${bold("Fecha y hora")}: ${data[0].current.date} - ${data[0].current.observationtime}
${bold("Zona horaria")}: GMT${data[0].location.timezone}`
      )
      .setThumbnail(data[0].current.imageUrl);
    return message.reply({ embeds: [embed] });
  }
});
