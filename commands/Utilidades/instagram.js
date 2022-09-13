let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'instagram',
    description: 'Muestra información acerca de una cuenta de Instagram.',
    cooldown: 3,
    aliases: ['ig'],
    category: 'Utilidades',
    usage: '<usuario>',
    example: 'marquito',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, ingresa el nombre de un usuario de Instagram.`);
            let user = args[1];
            if(user.startsWith('@')) user = user.slice(1);
            let data = await fetch(`https://www.instagram.com/${user}/?__a=1`).then(res => res.json());
            let embed = new discord.MessageEmbed();
            embed.setColor('RANDOM')
            embed.setTitle(`**${user}**`)
            embed.setURL(`https://www.instagram.com/${user}/`)
            embed.setThumbnail(data.graphql.user.profile_pic_url_hd)
            embed.addField('Nombre', data.graphql.user.full_name, true)
            embed.addField('Nombre de usuario', data.graphql.user.username, true)
            embed.addField('Número de seguidores', `${data.graphql.user.edge_followed_by.count}`, true)
            embed.addField('Número de seguidos', `${data.graphql.user.edge_follow.count}`, true)
            embed.addField('Número de posts', `${data.graphql.user.edge_owner_to_timeline_media.count}`, true);
            embed.setFooter({ text: `Pedido por ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) });
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error desconocido al intentar obtener la información.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});