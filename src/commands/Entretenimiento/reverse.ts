import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "reverse",
    description: "Pon en reversa cualquier texto con este comando.",
    cooldown: 3,
    usage: "<texto>",
    example: "Imagina que esto está al revés",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escibe el texto que pondré en reversa.", { mention: msg.author.username, emoji: "noargs" }));
            return msg.reply(args.slice(1).join(" ").split("").reverse().join(""));
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
