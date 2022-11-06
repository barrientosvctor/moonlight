import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "ping",
    description: "Muestra el ping acutal del bot.",
    cooldown: 3,
    async run(bot, msg) {
        try {
            return msg.reply(`Pong! ${bot.ws.ping}ms`);
        } catch (err) {
            console.error(err);
        }
    }
});