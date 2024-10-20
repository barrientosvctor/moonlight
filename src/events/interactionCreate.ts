import { EventBuilder } from "../structures/EventBuilder.js";

export default new EventBuilder({
  event: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commandsManager.getSlashCommand(interaction.commandName);
      if (command) {
        if (command.ownerOnly && interaction.user.id !== "617173543582433280") return;

        try {
          await command.run(interaction);
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
