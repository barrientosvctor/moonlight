let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'ship',
    description: 'Compara la relación de dos personas de Discord.',
    cooldown: 3,
    aliases: ['relacion'],
    category: 'Entretenimiento',
    usage: '<@usuario | ID> <@usuario | ID>',
    example: '@Kevin#0001 @Karla#0002',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o pon la ID del primer usuario.`);
            let user1 = await getUser(args[1]);
            if(!user1) return msg.channel.send(`**${msg.author.username}**, el usuario no existe.`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, menciona o pon la ID del otro usuario que quieres medir su relación con ${user1.username}.`);
            let user2 = await getUser(args[2]);
            if(!user2) return msg.channel.send(`**${msg.author.username}**, el usuario no existe.`);
            let percent = Math.floor(Math.random() * 101),
            embed = new discord.MessageEmbed();
            embed.setColor('RANDOM')
            embed.setImage(`https://api.popcat.xyz/ship?user1=${user1.displayAvatarURL({ size: 2048, format: 'png', dynamic: true })}&user2=${user2.displayAvatarURL({ size: 2048, format: 'png', dynamic: true })}`)
            embed.setDescription(`El porcentaje de relación entre **${user1.username}** y **${user2.username}** es de un **${percent}%**. ${bot.shipPercentage(percent)}`);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});