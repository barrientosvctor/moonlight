let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js');
database = require('../../base/packages/database');
module.exports = {
    name: 'threadCreate',
    /**
     * 
     * @param {Moonlight} bot 
     * @param {discord.ThreadChannel} thread 
     */
    async run(bot, thread) {
        try {
            thread.join();
            let db = new database('./databases/logs.json');
            if(db.has(thread.guild.id)) {
                let embed = new discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setTitle('Nuevo hilo creado.')
                    .setDescription(`Ha sido creado un nuevo hilo en el canal <#${thread.parentId}>`)
                    .addFields({ name: 'Nombre', value: thread.name }, { name: 'ID', value: thread.id.toString() });
                bot.channels.cache.get(await db.get(thread.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
