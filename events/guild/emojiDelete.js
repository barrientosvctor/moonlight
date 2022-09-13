let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'emojiDelete',
    /**
    * @param {Moonlight} bot
    * @param {discord.GuildEmoji} emoji
    */
    async run(bot, emoji) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(emoji.guild.id)) {
                let embed = new discord.MessageEmbed()
                    .setColor('RANDOM')
                    .setTimestamp()
                    .setTitle('Un emoji ha sido eliminado del servidor.')
                    .addField('Nombre', emoji.name);
                bot.channels.cache.get(await db.get(emoji.guild.id)).send({ embeds: [embed] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
