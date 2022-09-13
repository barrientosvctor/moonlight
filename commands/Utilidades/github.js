let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'github',
    description: 'Busca información del perfil de un usuario de GitHub.',
    cooldown: 3,
    aliases: [],
    category: 'Utilidades',
    usage: '<@usuario | usuario>',
    example: '@Alfonso',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el usuario de un perfil de GitHub.`);
            if(args[1].startsWith('@')) args[1] = args[1].slice(1);
            let data = await fetch(`https://api.github.com/users/${args[1]}`).then(res => res.json());
            embed = new discord.MessageEmbed();
            if(data.message) return msg.channel.send(`${bot.getEmoji('error')} El usuario @${args[1]} no existe en GitHub.`);
            let types = { 'User': 'Usuario', 'Organization': 'Organización' };

            embed.setAuthor({ name: `Perfil de ${data.login}` })
            embed.setThumbnail(data.avatar_url)
            embed.setColor('#202225')
            embed.setDescription(`
            > __Información general__
            **Nombre de usuario:** ${data.login} 
            **Nombre:** ${data.name ? data.name : 'No tiene nombre.'}
            **Biografía:** ${data.bio ? data.bio : 'No tiene descripción.'}
            **Email público:** ${data.email ? data.email : 'No tiene email público.'}
            **Localidad:** ${data.location ? data.location : 'No tiene ubicación.'}
            **Compañia:** ${data.company ? data.company : 'No tiene compañia.'}
            **Twitter:** ${data.twitter_username ? `[Perfil](https://twitter.com/${data.twitter_username})` : 'No tiene perfil de Twitter.'}
            **ID de la cuenta:** ${data.id}
            **Tipo de perfil:** ${types[data.type]}
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
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});