import { EventBuilder } from "../structures/EventBuilder.js";

export default new EventBuilder({
  event: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commandsManager.getSlashCommand(
        interaction.commandName
      );
      if (command) {
        if (
          !command.enabled &&
          command.ownerOnly &&
          interaction.user.id !== process.env.OWNER_ID
        ) {
          interaction.reply({
            content: "Comando no disponible, intenta más tarde.",
            ephemeral: true
          });
          return;
        }
        if (command.ownerOnly && interaction.user.id !== process.env.OWNER_ID) {
          interaction.reply({
            content: "No tienes permisos para usar este comando.",
            ephemeral: true
          });
          return;
        }

        if (
          command.clientPermissions &&
          !interaction.guild?.members.me?.permissions.has(
            command.clientPermissions
          )
        ) {
          const diffPerms = client.utils.diff(
            command.clientPermissions,
            interaction.guild!.members.me!.permissions.toArray()
          );
          interaction.reply({
            content: `Me faltan los siguientes permisos para ejecutar acciones sobre este comando.\n> ${client.utils.convertPermissionsToSpanish(diffPerms).join(", ")}`,
            ephemeral: true
          });
          return;
        }

        try {
          await command.run(interaction, client);
        } catch (error) {
          console.log("Hubo un error al intentar ejecutar esta interacción.");
          console.error(error);
        }
      }
    } else if (interaction.isUserContextMenuCommand()) {
      const command = client.commandsManager.getContextMenuCommand(
        interaction.commandName
      );
      if (command && command.run) {
        try {
          await command.run(interaction, client);
        } catch (error) {
          console.log(
            "Hubo un error al intentar ejecutar esta interacción de menú contextual de usuario."
          );
          console.error(error);
        }
      }
    }
  }
});
