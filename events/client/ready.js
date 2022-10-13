let Event = require('../../base/models/Event'),
discord = require('discord.js'),
{ app } = require('../../base/handlers/app');

module.exports = new Event({
    name: 'ready',
    once: true,
    run(bot) {
	try {
            app(bot);
            console.log(`${bot.user.tag} está listo.`);
            bot.user.setPresence({ activities: [{ name: `Multipropósito | !!help`, type: discord.ActivityType.Playing }], status: 'online' });
	} catch (error) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: error });
	}
    }
});
