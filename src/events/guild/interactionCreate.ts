import { ContextMenuCommandInteraction } from "discord.js";
import { EventBuilder } from "../../structures/EventBuilder.js";

export default new EventBuilder({
  name: "interactionCreate",
  async run(bot, interaction: ContextMenuCommandInteraction<"cached">) {
    try {
      const command = bot.slash.get(interaction.commandName);
      if (!command) return;

      try {
        command.callback({ bot, interaction });
      } catch (error) {
        console.error(error);
      }
    } catch (err) {
      if (err instanceof Error)
        bot.logger.writeError(err);
    }
  }
});
