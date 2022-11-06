import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "ping",
    description: "Muestra el ping acutal del bot.",
    cooldown: 3,
    async run(bot, msg) {
        try {
            return msg.reply(`Pong! ${bot.ws.ping}ms`);
        } catch (err) {
            bot.error("Hubo un error al intentar obtener el ping del bot.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});