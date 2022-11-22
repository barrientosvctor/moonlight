import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "pat",
    description: "Dale una palmadita en la cabeza a una persona del servidor.",
    cooldown: 3,
    usage: "<@miembro | ID>",
    example: "Neon#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	   try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("menciona a la persona que quieras darle una palmadita.", { mention: msg.author.username, emoji: "noargs" }));

            const member = getMember(args[1]);
            const data = await fetch(`https://nekos.life/api/v2/img/pat`, { method: "GET" }).then(res => res.json());
            let embed = new EmbedBuilder();

            if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
            if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No puedes darte una palmada a ti mismo, eso sería raro jeje.", { emoji: "error" }));
            else embed.setDescription(`¡**${msg.author.username}** le dio una palmadita a **${member.user?.username}**!`)
            embed.setColor("Random")
            embed.setImage(data.url);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
