import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { bold } from "discord.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "ping",
  cooldown: 15,
  category: "Información",
  description: "Muestra la latencia actual del bot en Discord.",
  run(client, message) {
    return message.reply(`Pong! 🏓 --- ${bold(`${client.ws.ping} ms`)}.`);
  }
});
