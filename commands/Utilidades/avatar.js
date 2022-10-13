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
            const user = await getUser(args[1]) || msg.author;
            let embed = new discord.EmbedBuilder();

            if(!user) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, este usuario no se encontró en Discord.`);

            embed.setDescription(`Avatar de ${user.tag}\n[PNG](${user.displayAvatarURL({ size: 2048, extension: 'png', forceStatic: true })}) | [JPG](${user.displayAvatarURL({ size: 2048, extension: 'jpg', forceStatic: true })}) | [WEBP](${user.displayAvatarURL({ size: 2048, extension: 'webp', forceStatic: true })}) ${user.avatar.startsWith('a_') ? `| [GIF](${user.displayAvatarURL({ size: 2048, extension: 'gif' })})` : ``}\n[Búscalo en Google](https://www.google.com/searchbyimage?image_url=${user.displayAvatarURL({ size: 2048, extension: 'png' })})`)
            embed.setImage(user.displayAvatarURL({ size: 2048, extension: 'png' }))
            embed.setFooter({ text: `Pedido por: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ extension: 'png' }) })
            embed.setColor('Random');
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
