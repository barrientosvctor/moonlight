import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "lick",
    description: "Lame a alguien del servidor con este comando.",
    cooldown: 3,
    usage: "<@miembro | ID>",
    example: "Neon#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	   try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("menciona a la persona que quieres lamer.", { mention: msg.author.username, emoji: "noargs" }));

            const member = getMember(args[1]);
            const data = await fetch(`https://kawaii.red/api/gif/lick/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
            let embed = new EmbedBuilder();

            if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
            if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No te puedes lamer a ti mismo, eso sería raro (de por si ya es raro lamer a otro).", { emoji: "error" }));
            if (member.user.id === msg.guild?.members.me?.user.id) return msg.reply("Ew no, intenta con otro.");

            embed.setDescription(`¡**${msg.author.username}** está lamiendo a **${member.user?.username}**!`)
            embed.setColor("Random")
            embed.setImage(data.response);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
