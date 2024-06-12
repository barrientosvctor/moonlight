import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
import { bold } from "discord.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "ping",
  cooldown: 15,
  category: "Información",
  description: "Muestra el tiempo de respuesta que tengo actualmente.",
  run(client, message) {
    return message.reply(`Pong! 🏓 --- ${bold(`${client.ws.ping} ms`)}.`);
  }
});
