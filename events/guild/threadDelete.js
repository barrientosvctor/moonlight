let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'threadDelete',
    /**
    * @param {Moonlight} bot
    * @param {discord.ThreadChannel} thread
    */
    async run(bot, thread) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(thread.guild.id)) {
                let embed = new discord.MessageEmbed()
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setTitle('Ha sido eliminado un hilo del servidor.')
                    .addField('Nombre', thread.name);
                bot.channels.cache.get(await db.get(thread.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
