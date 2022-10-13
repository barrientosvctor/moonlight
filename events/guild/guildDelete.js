let Event = require('../../base/models/Event'),
discord = require('discord.js');
module.exports = new Event({
    name: 'guildDelete',
    /** @param {discord.Guild} guild */
    async run(bot, guild) {
        try {
            const embed = new discord.EmbedBuilder()
            .setThumbnail(guild.iconURL({ extension: 'png', size: 2048 }))
            .setTitle(`${bot.user.username} fue sacado de un servidor!`)
            .setColor('Red')
            .addFields({ name: `• Información del servidor`, value: `\`\`\`diff\n+ Nombre: ${guild.name}\n+ Propietario: ${bot.users.cache.get(guild.ownerId).username}#${bot.users.cache.get(guild.ownerId).discriminator}\n+ Server ID: ${guild.id}\n+ Miembros: ${guild.memberCount} (Humanos: ${guild.members.cache.filter((m) => !m.user.bot).size})\n\`\`\`` })
            .setTimestamp();
            bot.logs.send({ embeds: [embed] });
        } catch (err) {
            bot.err({ name: `guildDelete`, type: 'event', filename: __filename, error: err });
        } 
    }
});
