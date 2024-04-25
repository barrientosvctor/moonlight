import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "cat",
  description: "Mira fotos de gatitos.",
  cooldown: 5,
  category: "Entretenimiento",
  async run(client, message) {
    const data = await fetch(`https://api.thecatapi.com/v1/images/search`).then(
      res => res.json()
    );
    if (!data)
      return message.reply(
        client.beautifyMessage("No fue posible encontrar una imagen.", {
          emoji: "error"
        })
      );

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription("¡Mira este lindo gatito!")
      .setImage(data[0].url)
      .setFooter({
        text: `Tamaño: ${data[0].width}x${data[0].height}`
      });

    return message.reply({ embeds: [embed] });
  }
});
