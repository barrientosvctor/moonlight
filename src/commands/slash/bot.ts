import { EmbedBuilder, SlashCommandBuilder, hyperlink } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("bot")
  .setDescription("Commands related to Moonlight.")
  .addSubcommand(cmd =>
    cmd
    .setName("invite")
    .setDescription("Invites Moonlight to their server."))
  .addSubcommand(cmd =>
    cmd
    .setName("ping")
    .setDescription("Checks the Moonlight's response time.")),
  testGuildOnly: true,
  async run(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "invite") {
      return interaction.reply(`Gracias por considerar agregarme a tu servidor. Presiona ${hyperlink("aquí", client.wrapper.get("bot.info", "invite"))} para invitarme. :heart:`);
    } else if (subcommand === "ping") {
      const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`
Mensajes: \`${Date.now() - interaction.createdTimestamp}ms\`
WebSocket: \`${client.ws.ping}ms\`
`)
      return interaction.reply({ content: "Pong! :ping_pong:", embeds: [embed] });
    }

    return interaction.reply("Haz uso de la variedad de comandos que ofrece éste comando.");
  },
});
