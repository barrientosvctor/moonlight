let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'emojiUpdate',
    /**
     * @param {Moonlight} bot
     * @param {discord.GuildEmoji} oldEmoji
     * @param {discord.GuildEmoji} newEmoji
     */
    async run(bot, oldEmoji, newEmoji) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(`${newEmoji.guild.id}`)) { 
                let embed = new discord.MessageEmbed()
                if(oldEmoji.name !== newEmoji.name) {
                    embed.setAuthor({ name: 'Nombre de emoji cambiado', iconURL: newEmoji.url })
                    embed.addFields({ name: 'Antes', value: oldEmoji.name }, { name: 'Después', value: newEmoji.name })
                    embed.setColor('RANDOM');
                }
                bot.channels.cache.get(await db.get(newEmoji.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err }); 
        } 
    }
}
