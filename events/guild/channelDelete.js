let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'channelDelete',
    /**
     * @param {Moonlight} bot
     * @param {discord.GuildChannel} channel
     */
    async run(bot, channel) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(channel.guildId)) {
                let embed = new discord.MessageEmbed()
                    .setTitle('Canal eliminado')
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setDescription(`Acaba de ser eliminado un canal existente del servidor.\n**Nombre:** ${channel.name}`);
                bot.channels.cache.get(await db.get(channel.guildId)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
