import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "slap",
    description: "Abofetea a alguien del servidor.",
    cooldown: 3,
    usage: "<@miembro | ID>",
    example: "Neon#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("debes mencionar a una persona para darle una bofetada.", { mention: msg.author.username, emoji: "error" }));

            const member = getMember(args[1]);
            const data = await fetch(`https://kawaii.red/api/gif/slap/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
            let embed = new EmbedBuilder();

            if (!member) return msg.reply(bot.replyMessage("no pude encontrar a esa persona en el servidor.", { emoji: "error" }));
            if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("¿Quieres hacerte daño? ¿estás loco?", { emoji: "error" }));
            if (member.user.id === bot.user.id) return msg.reply(bot.replyMessage("¿Qué te he hecho?", { emoji: "error" }));

            embed.setColor("Random")
            embed.setImage(data.response)
            embed.setDescription(`¡**${msg.author.username}** le dio una bofetada a **${member.user?.username}**!`);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
