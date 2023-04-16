import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "punch",
  description: "Golpea a alguien del servidor.",
  cooldown: 3,
  usage: "<@miembro | ID>",
  example: "Neon#0001",
  enabled: true,
  async run(bot, msg, args, prefix, getUser, getMember) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("tienes que mencionar a la persona que vas a golpear.", { mention: msg.author.username, emoji: "noargs" }));

      const member = getMember(args[1]);
      const data = await fetch(`https://kawaii.red/api/gif/punch/token=${process.env.KAWAII_TOKEN}/`, { method: "GET" }).then(res => res.json());
      let embed = new EmbedBuilder();

      if (!member) return msg.reply(bot.replyMessage("No pude encontrar a esa persona en el servidor.", { emoji: "error" }));
      if (member.user.id === msg.author.id) return msg.reply(bot.replyMessage("¿Te harías daño a ti mismo? ¿estás loco?", { emoji: "error" }));
      if (member.user.id === bot.user.id) return msg.reply(bot.replyMessage("¿Por qué me harías daño?", { emoji: "error" }));

      embed.setDescription(`¡**${msg.author.username}** golpeó a **${member.user.username}**!`)
      embed.setColor("Random")
      embed.setImage(data.response);
      return msg.channel.send({ embeds: [embed] });
    } catch (err) {
      bot.error("Hubo un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
