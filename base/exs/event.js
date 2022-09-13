let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js');
module.exports = {
    name: '',
    once: false,
    /**
     * 
     * @param {Moonlight} bot 
     */
    async run(bot) {
        try {
            // Código del evento acá
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}