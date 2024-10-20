import { EmbedBuilder } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "fox",
  description: "Mira fotos de zorros.",
  cooldown: 5,
  category: "Entretenimiento",
  async run(client, message) {
    const data = await fetch("https://randomfox.ca/floof/", {
      method: "GET"
    }).then(res => res.json());
    if (!data)
      return message.reply(
        client.beautifyMessage("No fue posible encontrar una imagen.", {
          emoji: "error"
        })
      );

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription("¡Mira este lindo zorro!")
      .setImage(data.image);

    return message.reply({ embeds: [embed] });
  }
});
