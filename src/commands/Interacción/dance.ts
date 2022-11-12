import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "dance",
    description: "Baila con una persona del servidor.",
    cooldown: 3,
    usage: "<@miembro | ID>",
    example: "Neon#0001",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember) {
	try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("menciona a la persona con la que vas a bailar.", { mention: msg.author.username, emoji: "noargs" }));
            const member = getMember(args[1]);
            const data = await fetch(`https://kawaii.red/api/gif/dance/token=${process.env.KAWAII_TOKEN}/`, { method: 'GET' }).then(res => res.json());
            let embed = new EmbedBuilder();

            if (!member) return msg.reply(bot.replyMessage("Este usuario no está en el servidor.", { emoji: "error" }));
            if(member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No puedes bailar con ti mismo, eso sería raro jeje.", { emoji: "error" }));

            embed.setDescription(`**${msg.author.username}** está bailando con **${member.user.username}**.`)
            embed.setColor("Random")
            embed.setImage(data.response);

            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
