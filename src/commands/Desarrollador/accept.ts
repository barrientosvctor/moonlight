import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "accept",
    description: "Acepta sugerencias o reportes de bug en el bot.",
    cooldown: 3,
    usage: "<--s/--r> <@usuario | ID> | Sugerencia de la persona",
    example: "--s 0000000000000000000 | Hola | Sugerencia/Reporte",
    enabled: true,
    ownerOnly: true,
    async run(bot, msg, args, prefix, getUser) {
	try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe **--s** para sugerencias o **--r** para reportes.", { mention: msg.author.username, emoji: "noargs" }));
            if (!["--s", "--r"].includes(args[1])) return msg.reply(bot.replyMessage("Valor no válido", { emoji: "error" }));

            if (!args[2]) return msg.channel.send(bot.replyMessage(`escribe la ID del usuario al que le quieres responder.\n**Uso:** ${prefix}${this.name} ${this.usage}`, { mention: msg.author.username, emoji: "noargs" }));
            const user = await getUser(args[2]);
            if (!user) return msg.reply(bot.replyMessage("Ese usuario no existe.", { emoji: "error" }));
            if (!args[3]) return msg.channel.send(bot.replyMessage(`escribe la sugerencia o reporte que envió el usuario\n**Uso:** ${prefix}${this.name} ${this.usage}`, { mention: msg.author.username, emoji: "noargs" }));

            let embed = new EmbedBuilder();

            if (args[1] === "--s") {
                args = args.slice(2).join(" ").split("|").slice(1);
                embed.setColor("Green")
                embed.setTimestamp()
                embed.setAuthor({ name: "¡Tu sugerencia fue aceptada!", iconURL: bot.user.displayAvatarURL() })
                embed.setDescription(`**¡Felicidades ${user.username}!**, tu sugerencia a Moonlight fue aceptada.\n\n> Tu sugerencia fue el siguiente:\n\`\`\`\n${args[0]}\n\`\`\``);
            } else if (args[1] === "--r") {
                args = args.slice(2).join(" ").split("|").slice(1);
                embed.setColor("Green")
                embed.setTimestamp()
                embed.setAuthor({ name: "¡Tu reporte fue solucionado!", iconURL: bot.user.displayAvatarURL() })
                embed.setDescription(`**¡Felicidades ${user.username}!**, el reporte que enviaste a Moonlight ya fue solucionado. Cualquier otro bug que veas lo puedes reportar con este comando, así aportarás al bot!\n\n> Tu reporte fue el siguiente:\n\`\`\`\n${args[0]}\n\`\`\``);
            }

            await user.send({ embeds: [embed] }).then(() => msg.reply(bot.replyMessage("Mensaje enviado exitosamente!", { emoji: "check" }))).catch(err => {
                msg.channel.send("Ocurrió un error al intentar enviar el mensaje a su mensaje privado.");
                console.error(err);
            });
	} catch (err) {
            bot.error("Hubo un error al intentar obtener los datos de la documentación.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
	}
    }
});
