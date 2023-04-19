import { EmbedBuilder } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "wink",
  description: "Guiña el ojo a una persona del servidor.",
  cooldown: 3,
  usage: "<@miembro | ID>",
  example: "Neon#0001",
  enabled: true,
  async run(bot, msg, args, prefix, getUser, getMember) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("menciona a la persona que quieres guiñarle el ojo.", { mention: msg.author.username, emoji: "noargs" }));

      const member = getMember(args[1]);
      const data = await fetch(`https://kawaii.red/api/gif/wink/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
      let embed = new EmbedBuilder();

      if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
      if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("No puedes guiñarte el ojo a ti mismo, eso sería muy raro jeje.", { emoji: "error" }));

      embed.setColor("Random")
      embed.setImage(data.response)
      embed.setDescription(`¡**${msg.author.username}** le guiñó el ojo a **${member.user.username}**!`);
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});

