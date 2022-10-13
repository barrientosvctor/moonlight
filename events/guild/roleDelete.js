let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'roleDelete',
    /** @param {discord.Role} role */
    async run(bot, role) {
        try {
            const db = new database('./databases/logs.json');
            if(db.has(role.guild.id)) {
                const embed = new discord.EmbedBuilder()
                .setTimestamp()
                .setColor('Random')
                .setTitle(`Se ha eliminado un rol en el servidor.`)
		.setDescription('** **')
		.addFields({ name: 'Nombre', value: role.name })
                bot.channels.cache.get(await db.get(role.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
