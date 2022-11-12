import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "protect",
    description: "Protege a una persona de otra persona en el servidor.",
    cooldown: 3,
    usage: "<@miembro | ID> <@miembro | ID>",
    example: "Neon#0001 Darken#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("debes mencionar a que usuario proteger.", { mention: msg.author.username, emoji: "noargs" }));

            const member1 = getMember(args[1]);
            if (!member1) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
            if (member1.user.id === bot.user.id) return msg.reply(bot.replyMessage("No puedes protegerme de nadie.", { emoji: "error" }));
            if (member1.user.id === msg.member.user.id) return msg.reply(bot.replyMessage("No puedes protegerte de ti mismo.", { emoji: "error" }));
            if (!args[2]) return msg.reply(bot.replyMessage(`Debes mencionar de quién quieres proteger a ${member1.user.username}.`, { emoji: "noargs" }));

            const member2 = getMember(args[2]);
            if (!member2) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
            if (member2.user.id === msg.author.id) return msg.reply(bot.replyMessage(`No puedes proteger a ${member1.user.username} de ti mismo.`, { emoji: "error" }));
            if (member2.user.id === bot.user.id) return msg.reply(bot.replyMessage("¿Yo qué he hecho?", { emoji: "error" }));
            if (member1.user.id === member2.user.id) return msg.reply(bot.replyMessage("¿Qué sentido tiene eso?", { emoji: "error" }));

            const data = await fetch(`https://kawaii.red/api/gif/protect/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
            const embed = new EmbedBuilder()
            .setDescription(`¡**${msg.author.username}** está protegiendo a **${member1.user.username}** de **${member2.user.username}**!`)
            .setImage(data.response)
            .setColor("Random");
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
