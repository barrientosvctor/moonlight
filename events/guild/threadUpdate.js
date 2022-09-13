let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'threadUpdate',
    /**
    * @param {Moonlight} bot
    * @param {discord.ThreadChannel} oldThread
    * @param {discord.ThreadChannel} newThread
    */
    async run(bot, oldThread, newThread) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(newThread.guild.id)) {
                let embed = new discord.MessageEmbed();
                embed.setColor('RANDOM')
                embed.setTimestamp()
                if(oldThread.name !== newThread.name) {
                    embed.setTitle(`Cambio de nombre del hilo #${newThread.name}.`)
                    embed.addFields({ name: 'Antes', value: oldThread.name ? oldThread.name : '** **' }, { name: 'Después', value: newThread.name ? newThread.name : '** **' })
                }
                if(oldThread.archived != newThread.archived) {
                    embed.setTitle(`Estado de archivado cambiado en #${newThread.name}.`)
                    embed.addFields({ name: 'Antes', value: oldThread.archived ? 'Hilo archivado' : 'Hilo desarchivado' }, { name: 'Después', value: newThread.archived ? 'Hilo archivado' : 'Hilo desarchivado' })
                }
                bot.channels.cache.get(await db.get(newThread.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
}
