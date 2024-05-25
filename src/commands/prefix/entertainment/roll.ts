import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "roll",
  description: "Lanza un dado de 6... Caras...? Tal vez.",
  cooldown: 5,
  category: "Entretenimiento",
  async run(_, message) {
    const attempt = Math.floor(Math.random() * 7);
    const embed = new EmbedBuilder().setColor("Random");

    if (attempt === 1) {
      embed
        .setDescription(
          `${message.author.username}, tiraste el dado, y cayó: **1**`
        )
        .setImage("https://i.imgur.com/SVNKSUH.png");
    } else if (attempt === 2) {
      embed
        .setDescription(
          `${message.author.username}, tiraste el dado, y cayó: **2**`
        )
        .setImage("https://i.imgur.com/WYDDVyi.png");
    } else if (attempt === 3) {
      embed
        .setDescription(
          `${message.author.username}, tiraste el dado, y cayó: **3**`
        )
        .setImage("https://i.imgur.com/qXzKGhY.png");
    } else if (attempt === 4) {
      embed
        .setDescription(
          `${message.author.username}, tiraste el dado, y cayó: **4**`
        )
        .setImage("https://i.imgur.com/YEM9Ti2.png");
    } else if (attempt === 5) {
      embed
        .setDescription(
          `${message.author.username}, tiraste el dado, y cayó: **5**`
        )
        .setImage("https://i.imgur.com/bHHdyql.png");
    } else if (attempt === 6) {
      embed
        .setDescription(
          `${message.author.username}, tiraste el dado, y cayó: **6**`
        )
        .setImage("https://i.imgur.com/YbpnXnm.png");
    } else {
      embed
        .setDescription(
          `${message.author.username}, tiraste el dado, y cayó: **9**... ¡Rompiste el juego!`
        )
        .setImage("https://i.imgur.com/to3YV2i.png");
    }

    return message.reply({ embeds: [embed] });
  }
});
