import { EmbedBuilder, bold, hyperlink, time } from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "github",
  description: "Busca usuarios de GitHub mediante este comando.",
  cooldown: 10,
  aliases: ["gh"],
  usage: "<usuario>",
  example: "craftzdog",
  category: "Utilidad",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("Escribe el usuario de un perfil de GitHub.", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );
    if (args[1].startsWith("@")) args[1] = args[1].slice(1);

    const data = await fetch(`https://api.github.com/users/${args[1]}`, {
      method: "GET"
    });
    const json = await data.json();
    if (data.status === 404)
      return message.reply(
        client.beautifyMessage(
          `El usuario ${bold(args[1])} no existe en GitHub.`,
          { emoji: "error" }
        )
      );

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(json.login)
      .setThumbnail(json.avatar_url).setDescription(`
> __Información general__
${bold("Nombre de usuario")}: ${json.login}
${bold("Nombre")}: ${json.name ? json.name : "No tiene nombre."}
${bold("Biografía")}: ${json.bio ? json.bio : "No tiene descripción."}
${bold("Email público")}: ${json.email ? json.email : "No tiene email público."}
${bold("Localidad")}: ${json.location ? json.location : "No tiene ubicación."}
${bold("Compañia")}: ${json.company ? json.company : "No tiene compañia."}
${bold("Twitter")}: ${json.twitter_username ? `[Perfil](https://twitter.com/${json.twitter_username})` : "No tiene perfil de Twitter."}
${bold("ID de la cuenta")}: ${json.id}
${bold("Fecha de creación")}: ${time(Math.ceil(new Date(json.created_at).getTime() / 1000))}
${bold("Última actualización")}: ${time(Math.ceil(new Date(json.updated_at).getTime() / 1000), "R")}

> __Links__
${hyperlink("Avatar", json.avatar_url)}
${hyperlink("Perfil", json.html_url)}
${hyperlink("Seguidores", `https://github.com/${json.login}?tab=followers`)} (${json.followers})
${hyperlink("Siguiendo", `https://github.com/${json.login}?tab=following`)} (${json.following})
${hyperlink("Repositorios", `https://github.com/${json.login}?tab=repositories`)} (${json.public_repos})
${hyperlink("Proyectos", `https://github.com/${json.login}?tab=projects`)}
${hyperlink("Paquetes", `https://github.com/${json.login}?tab=packages`)}`);
    return message.reply({ embeds: [embed] });
  }
});
