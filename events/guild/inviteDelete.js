let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'inviteDelete',
    /** @param {discord.Invite} invite */
    async run(bot, invite) {
        try {
            const db = new database('./databases/logs.json');
            if(db.has(invite.guild.id)) {
                bot.channels.cache.get(await db.get(invite.guild.id)).send({ embeds: [new discord.EmbedBuilder().setTitle('Se ha eliminado una invitación ya existente.').addFields({ name: 'Código', value: invite.code, inline: true }).setColor('Random').setTimestamp()] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
});
