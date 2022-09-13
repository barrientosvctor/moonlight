let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'steam',
    description: 'Obtiene información sobre un juego de Steam.',
    cooldown: 3,
    aliases: ['steamgame'],
    category: 'Utilidades',
    usage: '<juego>',
    example: 'Geometry Dash',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el nombre de un juego de Steam.`);
            let data = await fetch(`https://api.popcat.xyz/steam?q=${args.slice(1).join(' ').replace(' ', '%20')}`).then(res => res.json()),
            embed = new discord.MessageEmbed();
            if(!data) return msg.channel.send(`${bot.getEmoji('error')} El juego **${args.slice(1).join(' ')}** no pudo ser encontrado en Steam.`);
            embed.setAuthor({ name: data.name, iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png' })
            embed.setColor('RANDOM')
            embed.setThumbnail(data.thumbnail)
            embed.setImage(data.banner)
            embed.setDescription(`${data.description}\n\n**Tipo de producto:** ${data.type}\n**Precio:** ${data.price}\n**Página web:** ${data.website}\n**Desarrolladores:** ${data.developers.map(dev => dev).join(', ')}\n**Editores:** ${data.publishers.map(pub => pub).join(', ')}`);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});