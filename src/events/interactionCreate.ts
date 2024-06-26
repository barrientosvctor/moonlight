import { EventBuilder } from "../structures/EventBuilder.js";
import { CommandType } from "../types/command.types.js";

export default new EventBuilder({
  event: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commandsManager.getCommand(interaction.commandName, CommandType.ChatInput);
      if (command && command.run) {
        const application = await client.application?.fetch();
        if (command.ownerOnly && application && interaction.user.id !== application.owner?.id) return;

        try {
          await command.run(interaction, client);
        } catch (error) {
          console.log("Hubo un error al intentar ejecutar esta interacción.");
          console.error(error);
        }
      }
    } else if (interaction.isUserContextMenuCommand()) {
      const command = client.commandsManager.getCommand(interaction.commandName, CommandType.User);
      if (command && command.run) {
        try {
          await command.run(interaction, client);
        } catch (error) {
          console.log("Hubo un error al intentar ejecutar esta interacción de menú contextual de usuario.");
          console.error(error);
        }
      }

    }

  }
});
