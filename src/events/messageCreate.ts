import { EventBuilder } from "../structures/EventBuilder.js";
import { CommandType } from "../types/command.types.js";
import { bold } from "discord.js";

export default new EventBuilder({
  event: "messageCreate",
  async execute(message, client) {
    const prefix = "!!" as const;

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.substring(prefix.length).split(/\s+/g);

    if (!args[0]) return;

    const command = client.commandsManager.getCommand(args[0], CommandType.Legacy);

    if (!command) {
      message.reply(`El comando ${bold(args[0])} no fue encontrado.`)
        .then(msg => setTimeout(async () => {
          if (msg.deletable) await msg.delete();
        }, 5000));
      return;
    }

    if (command.ownerOnly && message.author.id !== client.application.owner?.id) return;

    if (command.cooldown && command.cooldown > 0) {
      if (!client.cooldown.has(command.name))
        client.cooldown.set(command.name, new Map());

      const cooldownMSAmount = command.cooldown * 1000;
      const commandCollection = client.cooldown.get(command.name);

      if (!commandCollection) return;

      if (commandCollection.has(message.author.id)) {
        const expirationTime = commandCollection.get(message.author.id)! + cooldownMSAmount;

        if (Date.now() < expirationTime) {
          const time_left = (expirationTime - Date.now()) / 1000;
          message.reply(`Espera! Necesitas esperar ${time_left < 1 ? 'unos segundos más' : time_left === 1 ? '*1 segundo*' : time_left >= 2 ? `*${time_left.toFixed(0)} segundos*` : `*${time_left.toFixed(0)} segundos*`} para volver a usar el comando **${command.name}**.`)
            .then(m => setTimeout(async () => {
              if (m.deletable)
                await m.delete();
            }, cooldownMSAmount));
          return;
        }
      }

      commandCollection.set(message.author.id, Date.now());
      setTimeout(() => {
        commandCollection.delete(message.author.id);
      }, cooldownMSAmount);
    }

    try {
      await command.run(client, message, args);
    } catch (error) {
      console.log("[ERROR]: Event could not running a command.");
      console.error(error);
    }
  }
});
