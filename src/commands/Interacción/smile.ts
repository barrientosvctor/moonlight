import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "smile",
    description: "Sonriele a alguien del servidor.",
    cooldown: 3,
    usage: "<@miembro | ID>",
    example: "Neon#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	   try {
            const data = await fetch(`https://kawaii.red/api/gif/smile/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
            const member = getMember(args[1]);
            let embed = new EmbedBuilder();

            if(!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
            if(member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No puedes sonreirte a ti mismo, eso sería raro jeje.", { emoji: "error" }))

            embed.setDescription(`¡**${msg.author.username}** le está sonriendo a **${member.user?.username}**!`);
            embed.setImage(data.response);
            embed.setColor("Random");
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
