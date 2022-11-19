import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "jumbo",
    description: "Obten la imagen de un emoji, añadido también con información sobre este.",
    cooldown: 3,
    usage: "<:emoji:>",
    example: ":RappiHappu:",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("debes poner un emoji", { mention: msg.author.username, emoji: "noargs" }));

            const emoji = msg.guild?.emojis?.cache?.find(e => e.name === args[1].split(':')[1]);
            if(!emoji) return msg.reply(bot.replyMessage("Ese emoji no se encontró en este servidor.", { emoji: "error" }));

            return msg.reply(`> Nombre: \`${emoji.name}\`\n> Emoji: ${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`}\n> ID: \`${emoji.id}\`\n> Identificador: \`${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`}\`\n> Fecha de creación: <t:${Math.ceil(emoji.createdTimestamp / 1000)}>\n> URL: ${emoji.url}`);
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
