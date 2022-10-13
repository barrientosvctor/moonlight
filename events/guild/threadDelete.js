let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'threadDelete',
    /** @param {discord.ThreadChannel} thread */
    async run(bot, thread) {
        try {
            const db = new database('./databases/logs.json');
            if(db.has(thread.guild.id)) {
                const embed = new discord.EmbedBuilder()
                .setTimestamp()
                .setColor('Random')
                .setTitle('Ha sido eliminado un hilo del servidor.')
		.setDescription('** **')
		.addFields({ name: 'Nombre', value: thread.name });
                bot.channels.cache.get(await db.get(thread.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
