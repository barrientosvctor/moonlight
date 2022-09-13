let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js');
module.exports = {
    name: 'guildDelete',
    /**
    * @param {Moonlight} bot
    * @param {discord.Guild} guild
    */
    async run(bot, guild) {
        try {
            let embed = new discord.MessageEmbed()
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTitle(`${bot.user.username} fue sacado de un servidor!`)
            .setColor('RED')
            .addFields({ name: `• Información del servidor`, value: `\`\`\`diff\n+ Nombre: ${guild.name}\n+ Propietario: ${bot.users.cache.get(guild.ownerId).username}#${bot.users.cache.get(guild.ownerId).discriminator}\n+ Server ID: ${guild.id}\n+ Miembros: ${guild.memberCount} (Humanos: ${guild.members.cache.filter((m) => !m.user.bot).size})\n\`\`\`` })
            .setTimestamp();
            bot.channels.cache.get('958831716485701713').send({ embeds: [embed] });
        } catch (err) {
            bot.err({ name: `guildDelete`, type: 'event', filename: __filename, error: err });
        } 
    }
}
