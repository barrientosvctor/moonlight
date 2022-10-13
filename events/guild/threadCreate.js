let Event = require('../../base/models/Event'),
discord = require('discord.js');
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'threadCreate',
    /** @param {discord.ThreadChannel} thread */
    async run(bot, thread) {
        try {
	    if(thread.joinable) await thread.join();

            const db = new database('./databases/logs.json');
            if(db.has(thread.guild.id)) {
                const embed = new discord.EmbedBuilder()
                .setColor('Random')
                .setTimestamp()
                .setTitle('Nuevo hilo creado.')
                .setDescription(`Ha sido creado un nuevo hilo en el canal <#${thread.parentId}>`)
                .addFields({ name: 'Nombre', value: thread.name }, { name: 'ID', value: thread.id.toString() });
                bot.channels.cache.get(await db.get(thread.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
