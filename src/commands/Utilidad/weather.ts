import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "weather",
    description: "Checa el clima con este comando.",
    cooldown: 3,
    aliases: ["wth"],
    usage: "<ciudad | país>",
    example: "New York",
    async run(bot, msg, args) {
        try {
            return msg.reply("a")
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
