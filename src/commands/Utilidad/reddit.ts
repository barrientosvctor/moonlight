import { TextChannel } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "reddit",
  description: "Busca perfiles de Reddit o subreddits.",
  cooldown: 3,
  usage: "<u/-r/nombre>",
  example: "r/Memes",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("para buscar un perfil o un subreddit escribe alguno de estos ejemplos:\n`u/usuario`: Para buscar el perfil de un usuario.\n`r/subreddit`: Busca un subreddit.", { mention: msg.author.username, emoji: "noargs" }));
      let embed = new MoonlightEmbedBuilder(msg.author, msg.guild!);
      embed.setTitle(args[1])

      let data;
      if (args[1].startsWith("u/")) {
        data = await fetch(`https://www.reddit.com/user/${args[1].slice(2)}/about.json`, { method: "GET" }).then(res => res.json());
        if (data.error === 404) return msg.reply(bot.replyMessage(`El usuario **${args[1].slice(2)}** no se pudo encontrar en Reddit.`, { emoji: "error" }));
        if (data.data.subreddit.over_18 && (msg.channel instanceof TextChannel && !msg.channel.nsfw)) return msg.reply(bot.replyMessage(`El usuario de Reddit **${args[1].slice(2)}** tiene su perfil marcado con contenido para adultos. Para obtener los resultados de este usuario debes de ejecutar este comando en un canal de texto marcado cómo NSFW.`, { emoji: "warning" }));

        embed.setColor("#FF4400")
        embed.setThumbnail(data.data.subreddit.icon_img.replace(/(amp;)/gi, ""))
        embed.setDescription(`**Nombre:** ${data.data.name}\n**Descripción:** ${data.data.subreddit.public_description ? data.data.subreddit.public_description : "Ninguno"}\n**ID:** ${data.data.id}\n**Tipo:** ${data.data.subreddit.subreddit_type}\n**Fecha de creación:** <t:${data.data.created_utc}>\n**Solicitudes:** ${data.data.subreddit.accept_followers ? "Activado" : "Desactivado"}\n**¿Cuenta +18?** ${data.data.subreddit.over_18 ? "Sí" : "No"}\n**¿Premium?** ${data.data.is_gold ? "Sí" : "No"}\n**¿Verificado?** ${data.data.verified ? "Sí" : "No"}\n\n**Awardee karma:** ${data.data.awardee_karma}\n**Link karma:** ${data.data.link_karma}\n**Awarder karma:** ${data.data.awarder_karma}\n**Comment karma:** ${data.data.comment_karma}\n**Karma total:** ${data.data.total_karma}\n\n[Perfil](https://www.reddit.com/user/${data.data.name})\n${data.data.subreddit.icon_img ? `[Avatar](${data.data.subreddit.icon_img.replace(/(amp;)/gi, "")})` : "Avatar: Ninguno"}\n${data.data.subreddit.snoovatar_img ? `[Snoovatar](${data.data.subreddit.snoovatar_img.replace(/(amp;)/gi, "")})` : "Snoovatar: Ninguno"}\n${data.data.subreddit.banner_img ? `[Banner](${data.data.subreddit.banner_img.replace(/(amp;)/gi, "")})` : "Banner: Ninguno"}`);
      } else if(args[1].startsWith("r/")) {
        data = await fetch(`https://www.reddit.com/r/${args[1].slice(2)}/about.json`, { method: "GET" }).then(res => res.json());
        //if (!data.data.after || !data.data.before) return msg.channel.send(`${bot.getEmoji("error")} El subreddit **${args[1].slice(2)}** no pudo ser encontrado en Reddit.`);
        if (data.data.over18 && (msg.channel instanceof TextChannel && !msg.channel.nsfw)) return msg.reply(bot.replyMessage(`El subreddit **${args[1].slice(2)}** está marcado con contenido para adultos. Para obtener los resultados de este subreddit debes de ejecutar este comando en un canal de texto marcado cómo NSFW.`, { emoji: "warning" }));

        embed.setColor(data.data.key_color === "" ? "#FF4400" : data.data.key_color)
        embed.setThumbnail(`${data.data.community_icon.replace(/(amp;)/gi, "")}`)
        embed.setDescription(`> __Información general__\n${data.data.public_description ? data.data.public_description : "No posee descripción"}\n\n**Usuarios activos:** ${data.data.accounts_active}\n**Suscriptores:** ${data.data.subscribers}\n**ID:** ${data.data.id}\n**¿Subreddit +18?** ${data.data.over18 ? "Sí" : "No"}\n**Fecha de creación:** <t:${data.data.created_utc}>\n**Idioma:** ${data.data.lang}\n\n> __Links__\n[Subreddit](https://www.reddit.com/r/${data.data.display_name})\n${data.data.community_icon ? `[Avatar](${data.data.community_icon.replace(/(amp;)/gi, "")})` : "Avatar: Ninguno"}`);
      } else return msg.reply(bot.replyMessage("Recuerda usar **u/** o **r/** antes del nombre del perfil o subreddit que vayas a buscar.", { emoji: "noargs" }));
      return msg.reply({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
