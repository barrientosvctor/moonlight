import { EmbedBuilder, SlashCommandBuilder, bold, hyperlink } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("utility")
  .setDescription("Utility commands.")
  .addSubcommand(cmd =>
    cmd
    .setName("avatar")
    .setDescription("Shows the avatar of a Discord user.")
    .addUserOption(user =>
      user
      .setName("user")
      .setDescription("Choose or type the ID of a Discord user.")
      .setRequired(true)))
  .addSubcommand(cmd =>
    cmd
    .setName("math")
    .setDescription("Resolves mathematical operations.")
    .addStringOption(input =>
      input
      .setName("operation")
      .setDescription("Type the mathematical operation to resolve.")
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(255)))
  .addSubcommand(cmd =>
    cmd
    .setName("morse")
    .setDescription("Translates text to morse.")
    .addStringOption(input =>
      input
      .setName("text")
      .setDescription("Type the text to translate.")
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(255))),
  testGuildOnly: true,
  async run(interaction, _) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "avatar") {
      const user = interaction.options.getUser("user", true);
      if (!user) return interaction.reply("Usuario no encontrado.");

      const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(
        `
> Avatar de ${bold(user.tag)}
${hyperlink("PNG", user.displayAvatarURL({ size: 2048, extension: "png", forceStatic: true }))} | ${hyperlink("JPG", user.displayAvatarURL({ size: 2048, extension: "jpg", forceStatic: true }))} | ${hyperlink("WEBP", user.displayAvatarURL({ size: 2048, extension: "webp", forceStatic: true }))} ${user.avatar?.startsWith("a_") ? `| ${hyperlink("GIF", user.displayAvatarURL({ size: 2048, extension: "gif" }))}` : ""}
`)
      .setImage(user.avatar?.startsWith("a_")
        ? user.displayAvatarURL({ size: 2048, extension: "gif" })
        : user.displayAvatarURL({ size: 2048, extension: "png" })
      );

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "math") {
      const operation = interaction.options.getString("operation", true);
      const text = await fetch(`https://api.mathjs.org/v4/?expr=${operation.replace(`+`, `%2B`).replace(`^`, `%5E`).replace(`/`, `%2F`)}`)
      .then(res => res.text());

      return interaction.reply(text);
    }

    return interaction.reply("Haz uso de los diferentes subcomandos que trae éste comando.");
  },
});
