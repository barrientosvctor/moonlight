import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "fox",
    description: "Muestra fotos de zorros.",
    cooldown: 3,
    enabled: true,
    async run(bot, msg) {
        try {
            const data = await fetch("https://randomfox.ca/floof/", { method: "GET" }).then(res => res.json());
            if (!data) return msg.reply(bot.replyMessage("No fue posible encontrar una imagen.", { emoji: "error" }))

            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
            .setDescription("¡Mira este lindo zorro!")
            .setImage(data.image);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
