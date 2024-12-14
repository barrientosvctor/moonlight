import { EmbedBuilder, SlashCommandBuilder, hyperlink } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("bot")
    .setDescription("Commands related to Moonlight.")
    .setDescriptionLocalizations({
      "es-ES": "Comandos relacionados a Moonlight."
    })
    .addSubcommand(cmd =>
      cmd
        .setName("invite")
        .setDescription("Invites Moonlight to their server.")
        .setDescriptionLocalizations({
          "es-ES": "Invita a Moonlight a su servidor."
        })
    )
    .addSubcommand(cmd =>
      cmd
        .setName("ping")
        .setDescription("Checks the Moonlight's response time.")
        .setDescriptionLocalizations({
          "es-ES": "Revise el tiempo de respuesta de Moonlight."
        })
    ),
  testGuildOnly: true,
  async run(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "invite") {
      return interaction.reply(
        `Gracias por considerar agregarme a tu servidor. Presiona ${hyperlink("aquí", client.wrapper.get("bot.info", "invite"))} para invitarme. :heart:`
      );
    } else if (subcommand === "ping") {
      const embed = new EmbedBuilder().setColor("Random").setDescription(`
Mensajes: \`${Date.now() - interaction.createdTimestamp}ms\`
WebSocket: \`${client.ws.ping}ms\`
`);
      return interaction.reply({
        content: "Pong! :ping_pong:",
        embeds: [embed]
      });
    }

    return interaction.reply({
      content: "Haz uso de la variedad de comandos que ofrece éste comando.",
      ephemeral: true
    });
  }
});
