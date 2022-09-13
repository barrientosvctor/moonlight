let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'channelUpdate',
    /**
     * @param {Moonlight} bot
     * @param {discord.GuildChannel} oldChannel
     * @param {discord.GuildChannel} newChannel
     */
    async run(bot, oldChannel, newChannel) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(newChannel.guildId)) {
                let embed = new discord.MessageEmbed()
                embed.setColor('RANDOM')
                embed.setFooter({ text: `ID: ${newChannel.id}` })
                if(oldChannel.name !== newChannel.name) {
                    embed.setTitle(`El nombre ${newChannel.type === 'GUILD_CATEGORY' ? 'de la categoría' : 'del canal'} ${newChannel.name} ha cambiado su nombre.`)
                    embed.addFields({ name: 'Antes', value: oldChannel.name }, { name: 'Después', value: newChannel.name })
                }
                if(oldChannel.topic !== newChannel.topic) {
                    embed.setTitle(`La descripción ${newChannel.type === 'GUILD_CATEGORY' ? 'de la categoría' : 'del canal'} ${newChannel.name} ha cambiado.`)
                    embed.addFields({ name: 'Antes', value: oldChannel.topic ? oldChannel.topic : `** **` }, { name: 'Después', value: newChannel.topic ? newChannel.topic : '** **' })
                }
                bot.channels.cache.get(await db.get(newChannel.guildId)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
}
