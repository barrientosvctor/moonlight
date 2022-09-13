let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    /**
    * @param {Moonlight} bot
    * @param {discord.BaseCommandInteraction} int
    */
    async run(bot, int) {
	try {
	    let slash = bot.slash.get(int.commandName);
	    if(!slash) return;

	    async function executeCommand() {
		await int.deferReply().catch(() => {});

		try {
		    slash.run(bot, int);
		} catch (err) {
		    console.error(err);
		}
	    }

	    if(int.isCommand()) await executeCommand();
	    if(int.isUserContextMenu()) await executeCommand();
	    if(int.isMessageContextMenu()) await executeCommand();
	    if(int.isContextMenu()) await executeCommand();
	} catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
	}
    }
}
