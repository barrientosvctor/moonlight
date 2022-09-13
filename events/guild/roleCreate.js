let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'roleCreate',
    /**
    * @param {Moonlight} bot
    * @param {discord.Role} role
    */
    async run(bot, role) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(role.guild.id)) {
                bot.channels.cache.get(await db.get(role.guild.id)).send({ embeds: [new discord.MessageEmbed().setTimestamp().setColor('RANDOM').setTitle(`El rol @${role.name} ha sido creado.`).addFields({ name: 'Nombre', value: role.name, inline: true }, { name: 'ID', value: role.id.toString(), inline: true })] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
