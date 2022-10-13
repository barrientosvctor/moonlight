let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'emojiDelete',
    /** @param {discord.GuildEmoji} emoji */
    async run(bot, emoji) {
        try {
            const db = new database('./databases/logs.json');
            if(db.has(emoji.guild.id)) {
                let embed = new discord.EmbedBuilder()
                    .setColor('Random')
                    .setTimestamp()
                    .setTitle('Un emoji ha sido eliminado del servidor.')
                    .addFields({ name: 'Nombre', value: emoji.name });
                bot.channels.cache.get(await db.get(emoji.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
