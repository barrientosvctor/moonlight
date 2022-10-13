let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'emojiCreate',
    /** @param {discord.GuildEmoji} emoji */
    async run(bot, emoji) {
        try {
            const db = new database('./databases/logs.json');
            if(db.has(`${emoji.guild.id}`)) {
                let embed = new discord.EmbedBuilder()
                    .setAuthor({ name: 'Emoji añadido', iconURL: emoji.url })
                    .addFields({ name: 'Nombre', value: emoji.name }, { name: 'ID', value: emoji.id.toString() }, { name: 'Emoji', value: `** **` })
                    .setImage(emoji.url)
                    .setColor('Random')
                    .setTimestamp();
                bot.channels.cache.get(await db.get(`${emoji.guild.id}`)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
});
