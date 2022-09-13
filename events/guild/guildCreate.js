let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js');
module.exports = {
    name: 'guildCreate',
    /**
    *
    * @param {Moonlight} bot
    * @param {discord.Guild} guild
    */
    async run(bot, guild) {
        try {
            let embed = new discord.MessageEmbed()
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTitle(`${bot.user.username} ha sido añadido a un nuevo servidor!`)
            .addFields({ name: '• Información del servidor', value: `\`\`\`diff\n+ Nombre: ${guild.name}\n+ Propietario: ${bot.users.cache.get(guild.ownerId).username}#${bot.users.cache.get(guild.ownerId).discriminator}\n+ Server ID: ${guild.id}\n+ Miembros: ${guild.memberCount} (Humanos: ${guild.members.cache.filter((m) => !m.user.bot).size})\n\`\`\`` }, { name: `• Estadísticas de ${bot.user.tag}`, value: `\`\`\`diff\n- Servidores: ${bot.guilds.cache.size.toLocaleString()}\n- Usuarios: ${bot.users.cache.size.toLocaleString()}\n- Canales: ${bot.channels.cache.size.toLocaleString()}\n- Emotes: ${bot.emojis.cache.size.toLocaleString()}\n\`\`\`` })
            .setColor('GREEN')
            .setTimestamp();
            bot.channels.cache.get('958831716485701713').send({ embeds: [embed] });
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
}
