import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "github",
    description: "Busca usuarios de GitHub mediante este comando.",
    cooldown: 3,
    usage: "<usuario>",
    example: "craftzdog",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el usuario de un perfil de GitHub.", { mention: msg.author.username, emoji: "noargs" }));
            if (args[1].startsWith("@")) args[1] = args[1].slice(1);

            const data = await fetch(`https://api.github.com/users/${args[1]}`, { method: "GET" }).then(res => res.json());
            if(data.message) return msg.reply(bot.replyMessage(`El usuario **${args.slice(1).join(" ")}** no existe en GitHub.`, { emoji: "error" }));

            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
            .setTitle(data.login)
            .setThumbnail(data.avatar_url)
            .setDescription(`
            > __Información general__
            **Nombre de usuario:** ${data.login} 
            **Nombre:** ${data.name ? data.name : 'No tiene nombre.'}
            **Biografía:** ${data.bio ? data.bio : 'No tiene descripción.'}
            **Email público:** ${data.email ? data.email : 'No tiene email público.'}
            **Localidad:** ${data.location ? data.location : 'No tiene ubicación.'}
            **Compañia:** ${data.company ? data.company : 'No tiene compañia.'}
            **Twitter:** ${data.twitter_username ? `[Perfil](https://twitter.com/${data.twitter_username})` : 'No tiene perfil de Twitter.'}
            **ID de la cuenta:** ${data.id}
            **Fecha de creación:** <t:${Math.ceil(new Date(data.created_at).getTime() / 1000)}>
            **Última actualización:** <t:${Math.ceil(new Date(data.updated_at).getTime() / 1000)}:R>

            > __Links__
            [Avatar](${data.avatar_url})
            [Perfil](${data.html_url})
            [Seguidores](https://github.com/${data.login}?tab=followers) (${data.followers})
            [Siguiendo](https://github.com/${data.login}?tab=following) (${data.following})
            [Repositorios](https://github.com/${data.login}?tab=repositories) (${data.public_repos})
            [Proyectos](https://github.com/${data.login}?tab=projects)
            [Paquetes](https://github.com/${data.login}?tab=packages)`);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
