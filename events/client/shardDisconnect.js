let Event = require('../../base/models/Event'),
discord = require('discord.js');

module.exports = new Event({
    name: 'shardDisconnect',
    /**
     * @param {CloseEvent} event
     * @param {number} id
     */
    run(bot, event, id) {
	try {
	    console.log(event.reason);
            console.log(`Shard: ${id} desconectado por la razón: ${event.reason}`);
	} catch (error) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: error });
	}
    }
});
