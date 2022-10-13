let Event = require('../../base/models/Event'),
discord = require('discord.js');

module.exports = new Event({
    name: 'shardError',
    /**
     * @param {Error} error
     * @param {number} shardId
     */
    run(bot, error, shardId) {
	try {
	    console.error(error);
            console.log(`Shard: ${shardId} encontró un error.`);
	} catch (error) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: error });
	}
    }
});
