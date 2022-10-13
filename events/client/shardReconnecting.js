let Event = require('../../base/models/Event'),
discord = require('discord.js');

module.exports = new Event({
    name: 'shardReconnecting',
    /**
     * @param {number} id
     */
    run(bot, id) {
	try {
            console.log(`Shard: ${id} está intentado reconectarse.`);
	} catch (error) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: error });
	}
    }
});
