let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'roleDelete',
    /**
    * @param {Moonlight} bot
    * @param {discord.Role} role
    */
    async run(bot, role) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(role.guild.id)) {
                let embed = new discord.MessageEmbed()
                    .setTimestamp()
                    .setColor('RANDOM')
                    .setTitle(`Se ha eliminado un rol en el servidor.`)
                    .addField('Nombre', role.name);
                bot.channels.cache.get(await db.get(role.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
