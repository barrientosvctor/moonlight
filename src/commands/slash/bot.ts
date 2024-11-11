import { SlashCommandBuilder, hyperlink } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("bot")
  .setDescription("Comandos relacionados a Moonlight.")
  .addSubcommand(cmd =>
    cmd
    .setName("invite")
    .setDescription("Invita a Moonlight a tu servidor.")),
  testGuildOnly: true,
  async run(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "invite") {
      return interaction.reply(`Gracias por considerar agregarme a tu servidor. Presiona ${hyperlink("aquí", client.wrapper.get("bot.info", "invite"))} para invitarme. :heart:`);
    }

    return interaction.reply("Haz uso de la variedad de comandos que ofrece éste comando.");
  },
});
