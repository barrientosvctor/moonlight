import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "hug",
    description: "Abraza a la persona que gustes con este comando.",
    cooldown: 3,
    usage: "<@miembro | ID>",
    example: "Neon#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	   try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("menciona a la persona que quieras abrazar.", { mention: msg.author.username, emoji: "noargs" }));

            const member = getMember(args[1]);
            const data = await fetch(`https://nekos.life/api/v2/img/hug`, { method: "GET" }).then(res => res.json());
            let embed = new EmbedBuilder();

            if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
            if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No puedes abrazarte a ti mismo, eso sería muy raro jeje.", { emoji: "error" }));

            embed.setColor("Random")
            embed.setDescription(`¡**${msg.author.username}** le dio un fuerte abrazo a **${member.user.username}**!`)
            embed.setImage(data.url);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
