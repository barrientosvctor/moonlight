import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "math",
    description: "Una calculadora que resuelve problemas matemáticos.",
    cooldown: 3,
    aliases: ["calc"],
    usage: "<operacion>",
    example: "(2*6)+6",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe la operación matemática que necesitas resolver.", { mention: msg.author.username, emoji: "noargs" }));
            const data = await fetch(`https://api.mathjs.org/v4/?expr=${args.slice(1).join(" ").replace(`+`, `%2B`).replace(`^`, `%5E`).replace(`/`, `%2F`)}`).then(res => res.json());
            return msg.reply(`**Resultado:** ${data}`);
        } catch (err) {
            bot.error("Syntax Error. Asegurate de escribir bien la operación matemática.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
