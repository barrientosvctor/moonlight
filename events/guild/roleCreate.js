let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'roleCreate',
    /** @param {discord.Role} role */
    async run(bot, role) {
        try {
            const db = new database('./databases/logs.json');
            if(db.has(role.guild.id)) {
                bot.channels.cache.get(await db.get(role.guild.id)).send({ embeds: [new discord.EmbedBuilder().setTimestamp().setColor('Random').setTitle(`El rol @${role.name} ha sido creado.`).addFields({ name: 'Nombre', value: role.name, inline: true }, { name: 'ID', value: role.id.toString(), inline: true }).setDescription('** **')] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
