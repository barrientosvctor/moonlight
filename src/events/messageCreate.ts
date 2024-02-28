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
      }, 5000))
      return;
    }

    try {
      await command.run(client, message, args);
    } catch (error) {
      console.log("[ERROR]: Event could not running a command.");
      console.error(error);
    }
  }
});
