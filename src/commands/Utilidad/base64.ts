import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "base64",
    description: "Encriptaciones o desencriptaciones basadas en 64 bits.",
    cooldown: 3,
    aliases: ["64bits"],
    usage: "<decode / encode> <texto>",
    example: "encode Mensaje que será codificado.",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe alguna de las siguientes opciones:\n`encode`: Encripta un mensaje a código base64.\n`decode`: Desencripta un código base64 a texto.", { mention: msg.author.username, emoji: "noargs" }));
            if (!["decode", "encode"].includes(args[1])) return msg.reply(bot.replyMessage("Opción no válida.", { emoji: "error" }));
            if (!args[2]) return msg.channel.send(bot.replyMessage("escribe el texto o código que vas a encriptar o desencriptar.", { mention: msg.author.username, emoji: "noargs" }));
            if (args.slice(2).join(" ").length > 500) return msg.reply(bot.replyMessage(`El texto no puede tener más de 500 carácteres. Tu texto contiene **${args.slice(2).join(" ").length}** carácteres.`, { emoji: "error" }));

            let data;
            if (args[1] === "encode") {
                data = await fetch(`https://some-random-api.ml/base64?encode=${encodeURIComponent(args.slice(2).join(" "))}`, { method: "GET" }).then(res => res.json());
                return msg.reply(`${data.base64}`);
            } else {
                data = await fetch(`https://some-random-api.ml/base64?decode=${encodeURIComponent(args[2])}`, { method: "GET" }).then(res => res.json());
                return msg.reply(`${data.text}`);
            }
        } catch (err) {
            bot.error("Syntax Error. Asegurate de escribir bien la operación matemática.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
