import { SlashCommandBuilder, hyperlink } from "discord.js";
import { SlashCommand } from "../../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder().setName("invite").setDescription("¡Invita al bot usando éste comando!"),
  run(interaction, client) {
    return interaction.reply(`Gracias por considerar añadirme a tú servidor. Presiona ${hyperlink("aquí", client.wrapper.get("bot.info", "invite"))} para invitarme a tu servidor. :heart:`);
  }
});
