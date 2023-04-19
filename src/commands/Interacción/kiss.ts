import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "kiss",
  description: "Besa a alguien del servidor.",
  cooldown: 3,
  usage: "<@miembro | ID>",
  example: "Neon#0001",
  enabled: true,
  async run(bot, msg, args, prefix, getUser, getMember) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("menciona a la persona que quieras besar.", { mention: msg.author.username, emoji: "noargs" }));

      const member = getMember(args[1]) || msg.guild?.members?.cache.get(args[1]);
      const data = await fetch(`https://nekos.life/api/v2/img/kiss`, { method: "GET" }).then(res => res.json());
      let embed = new EmbedBuilder();

      if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
      if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No puedes besarte a ti mismo, eso sería muy raro jeje.", { emoji: "error" }));

      embed.setColor("Random")
      embed.setDescription(`¡**${msg.author.username}** le dio un beso a **${member.user.username}**!`)
      embed.setImage(data.url);
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
