import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, Interaction } from "discord.js";
import { MoonlightDatabase } from "../../databases";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "prefix",
    description: "Cambia el prefix del bot en el servidor.",
    cooldown: 3,
    usage: "<prefix>",
    example: "mm!",
    enabled: true,
    memberPerms: ["ManageGuild"],
    async run(bot, msg, args, prefix) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el nuevo prefix que tendré en el servidor.", { mention: msg.author.username, emoji: "noargs" }));
            if (args[1].length > 4) return msg.reply(bot.replyMessage("El nuevo prefix no debe ser mayor a 4 carácteres.", { emoji: "error" }));
            const db = new MoonlightDatabase("prefix.json");

            if (args[1] === "!!") {
                if (db.has(msg.guildId)) {
                    db.delete(msg.guildId);
                    return msg.reply(`${bot.getEmoji('check')} Mi prefix a sido reiniciado a **!!**`);
                } else return msg.reply(bot.replyMessage("Mi prefix predeterminado ya era **!!**", { emoji: "error" }));
            } else if (args[1] === prefix) return msg.reply(bot.replyMessage("Ya tengo establecido ese prefix.", { emoji: "error" }));
            else {
                db.set(msg.guildId, args[1]);
                return msg.reply(bot.replyMessage(`Mi prefix ha sido establecido a **${args[1]}**`, { emoji: "check" }));
            }
        } catch (err) {
            bot.error("Hubo un error al intentar efectuar este comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
