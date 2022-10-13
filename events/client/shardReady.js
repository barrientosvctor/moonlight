let Event = require('../../base/models/Event'),
discord = require('discord.js');

module.exports = new Event({
    name: 'shardReady',
    /** @param {number} id */
    run(bot, id) {
	try {
            console.log(`Shard: ${id} está preparado para funcionar.`);
	} catch (error) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: error });
	}
    }
});
