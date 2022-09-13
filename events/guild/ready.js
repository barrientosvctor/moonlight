let Moonlight = require('../../base/Moonlight'),
{ app } = require('../../base/handlers/app');
module.exports = {
    name: 'ready',
    once: true,
    /**
     * 
     * @param {Moonlight} bot 
     */
    run(bot) {
        try {
            app(bot);
            console.log(`${bot.user.tag} está listo.`);
            bot.user.setPresence({ activities: [{ name: `Multipropósito | !!help`, type: 'PLAYING' }], status: 'online' });
        } catch (error) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: error });
        }
    }
}
