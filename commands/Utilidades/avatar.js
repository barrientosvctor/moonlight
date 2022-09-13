let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'avatar',
    description: 'Muestra la foto de perfil de cualquier usuario de Discord.',
    cooldown: 3,
    aliases: ['pfp', 'foto'],
    category: 'Utilidades',
    usage: '[@usuario | ID]',
    example: '@Neon#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            /** @type {discord.User} */
            let user = await getUser(args[1]) || msg.author,
            embed = new discord.MessageEmbed();
            console.log(user);
            if(!user) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, este usuario no se encontró en Discord.`);
            embed.setDescription(`Avatar de ${user.tag}\n[PNG](${user.displayAvatarURL({ size: 2048, format: 'png' })}) | [JPG](${user.displayAvatarURL({ size: 2048, format: 'jpg' })}) | [WEBP](${user.displayAvatarURL({ size: 2048, format: 'webp' })}) ${user.avatar.startsWith('a_') ? `| [GIF](${user.displayAvatarURL({ size: 2048, format: 'gif', dynamic: true })})` : ``}\n[Búscalo en Google](https://www.google.com/searchbyimage?image_url=${user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true })})`)
            embed.setImage(user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true }))
            embed.setFooter({ text: `Pedido por: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
            embed.setColor('RANDOM');
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});