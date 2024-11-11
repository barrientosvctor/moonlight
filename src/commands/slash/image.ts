import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("image")
  .setDescription("Mira imagenes de distintas cosas")
  .addSubcommand(cmd =>
    cmd
    .setName("cat")
    .setDescription("Mira imágenes de gatitos."))
  .addSubcommand(cmd =>
    cmd
    .setName("dog")
    .setDescription("Mira imágenes de perritos."))
  .addSubcommand(cmd =>
    cmd
    .setName("fox")
    .setDescription("Mira imágenes de zorros.")),
  testGuildOnly: true,
  async run(interaction, _) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "cat") {
      const data = await fetch(`https://api.thecatapi.com/v1/images/search`).then(res => res.json());
      if (!data)
        return interaction.reply("No fue posible encontrar una imagen.");

      const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription("¡Mira este lindo gatito!")
      .setImage(data[0].url)
      .setFooter({ text: `Tamaño: ${data[0].width}x${data[0].height}` });

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "dog") {
      const data = await fetch("https://api.thedogapi.com/v1/images/search", {
        method: "GET"
      }).then(res => res.json());
      if (!data)
        return interaction.reply("No fue posible encontrar una imagen.");

      const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription("¡Mira este lindo perrito!")
      .setImage(data[0].url)
      .setFooter({
        text: `Tamaño: ${data[0].width}x${data[0].height}`
      });
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "fox") {
      const data = await fetch("https://randomfox.ca/floof/", {
        method: "GET"
      }).then(res => res.json());
      if (!data)
        return interaction.reply("No fue posible encontrar una imagen.");

      const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription("¡Mira este lindo zorro!")
      .setImage(data.image);

      return interaction.reply({ embeds: [embed] });
    }

    return interaction.reply("Haz uso de la variedad de comandos que ofrece éste comando.");
  }
});
