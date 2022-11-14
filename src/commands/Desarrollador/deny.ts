import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "deny",
    description: "Rechaza sugerencias en el bot.",
    cooldown: 3,
    usage: "<@usuario / ID | Sugerencia de la persona>",
    example: "0000000000000000000 | Sugerencia",
    enabled: true,
    ownerOnly: true,
    async run(bot, msg, args, prefix, getUser) {
	try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe la ID del usuario a responder.", { mention: msg.author.username, emoji: "noargs" }));

            const user = await getUser(args[1]);
            if (!user) return msg.reply(bot.replyMessage("Ese usuario no existe en Discord.", { emoji: "error" }));
            if (!args[2] || args[2] !== "|") return msg.reply(bot.replyMessage("Agrega un **|** para seguir con el siguiente argumento.", { emoji: "noargs" }));
            if (!args[3]) return msg.reply(bot.replyMessage(`Escribe la sugerencia del usuario ${user?.tag}`, { emoji: "noargs" }));
            args = args.slice(1).join(" ").split("|").slice(1);

            const embed = new EmbedBuilder()
            .setColor("Red")
            .setTimestamp()
            .setAuthor({ name: "Tu sugerencia fue rechazada.", iconURL: bot.user.displayAvatarURL() })
            .setDescription(`**¡Oh no ${user?.username}!** Lamento informarte que tu sugerencia fue rechazada, si gustas puedes sugerir otras funciones en un futuro.\n\n> Tu sugerencia fue la siguiente:\n\`\`\`\n${args[0]}\`\`\``);

            await user.send({ embeds: [embed] }).then(() => msg.reply(bot.replyMessage("Mensaje enviado exitosamente!", { emoji: "check" }))).catch(err => {
                msg.channel.send("Ocurrió un error al intentar enviar el mensaje a su mensaje privado.");
                console.error(err);
            });
	} catch (err) {
            bot.error("Hubo un error al intentar obtener los datos de la documentación.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
	}
    }
});
