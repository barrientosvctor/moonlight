import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "run",
  description: "Sal corriendo de una persona o del chat.",
  cooldown: 3,
  usage: "[@miembro | ID]",
  example: "Neon#0001",
  enabled: true,
  async run(bot, msg, args, prefix, getUser, getMember) {
    try {
      const data = await fetch(`https://kawaii.red/api/gif/run/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
      let embed = new EmbedBuilder();
      embed.setColor("Random")
      embed.setImage(data.response);

      if (!args[1]) embed.setDescription(`¡**${msg.author.username}** salió corriendo del chat!`);
      else {
        const member = getMember(args[1]);
        if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
        if (member.user.id === msg.author.id) return msg.reply("¿Qué sentido tiene eso?");

        embed.setDescription(`¡**${msg.author.username}** salió corriendo de **${member.user.username}**!`);
      }
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
