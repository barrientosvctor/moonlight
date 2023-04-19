import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "bite",
  description: "Muerde a algún usuario con este comando.",
  cooldown: 3,
  usage: "<@miembro | ID>",
  example: "Neon#0001",
  enabled: true,
  async run(bot, msg, args, prefix, getUser, getMember) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("menciona a la persona que vas a morder.", { mention: msg.author.username, emoji: "noargs" }));
      const member = getMember(args[1]);
      if (!member) return msg.reply(bot.replyMessage("Este usuario no está en el servidor.", { emoji: "error" }));
      if (member.user.id === msg.author.id) return msg.channel.send(bot.replyMessage("¿por qué te morderías a ti mismo?", { mention: msg.author.username }));
      if (member.user.id === bot.user.id) return msg.channel.send(bot.replyMessage("¡No me gusta que me muerdan, prueba con otro!", { mention: msg.author.username }));

      const data = await fetch(`https://kawaii.red/api/gif/bite/token=${process.env.KAWAII_TOKEN}/`).then(res => res.json());
      const embed = new EmbedBuilder()
      .setDescription(`**${msg.author.username}** modió a ${member.user.username}`)
      .setColor("DarkGrey")
      .setImage(data.response);

      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
