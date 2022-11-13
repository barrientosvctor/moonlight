import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "clyde",
    description: "Muestra un mensaje del bot Clyde con el mensaje que le pongas.",
    cooldown: 3,
    usage: "<texto>",
    example: "¡Hola a todos!",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe un mensaje para añadir al mensaje de Clyde.", { mention: msg.author.username, emoji: "noargs" }));
            if (args.slice(1).join(" ").length > 72) return msg.reply(bot.replyMessage("El texto es demasiado largo! Escribe algo menor a 73 carácteres.", { emoji: "error" }));

            const data = await fetch(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args.slice(1).join(" ").replace(" ", "%20")}`).then(res => res.json());
            if (!data) return msg.reply(bot.replyMessage("No fue posible obtener la imagen.", { emoji: "error" }));

            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
            .setDescription("_ _")
            .setImage(data.message);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
