let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'messageDelete',
    /** @param {discord.Message} msg */
    async run(bot, msg) {
        try {
            bot.snipes.set(msg.channel.id, {
                content: msg.content || null,
                channel: msg.channel,
                image: msg.attachments.first()?.proxyURL || null,
                author: msg.member,
                time: Date.now()
            });
	    const db = new database('./databases/logs.json');
	    if(db.has(msg.guild.id)) {
		const embed = new discord.EmbedBuilder()
                    .setColor('Random')
                    .setTimestamp()
                    .setTitle('Mensaje eliminado.')
                    .addFields({ name: 'Mensaje', value: msg.content }, { name: 'Autor', value: msg.author.tag });
                bot.channels.cache.get(await db.get(msg.guild.id)).send({ embeds: [embed] });
	    }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
