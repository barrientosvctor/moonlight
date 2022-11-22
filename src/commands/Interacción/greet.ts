import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "greet",
    description: "Saluda a una persona o a todos el en chat.",
    cooldown: 3,
    usage: "[@miembro | ID]",
    example: "Neon#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	   try {
            const data = await fetch(`https://kawaii.red/api/gif/wave/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
            let embed = new EmbedBuilder();
            embed.setColor("Random")
            embed.setImage(data.response)

	       if (!args[1]) embed.setDescription(`¡**${msg.author.username}** está saludando a todos en el chat!`);
	       else {
		      const member = getMember(args[1]);
		      if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
		      if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No puedes saludarte a ti mismo, eso sería raro jeje.", { emoji: "error" }));

		      embed.setDescription(`¡**${msg.author.username}** está saludando a **${member.user.username}**!`);
	       }
           return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
