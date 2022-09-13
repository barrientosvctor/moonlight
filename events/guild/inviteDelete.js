let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'inviteDelete',
    /**
    * @param {Moonlight} bot
    * @param {discord.Invite} invite
    */
    async run(bot, invite) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(invite.guild.id)) {
                bot.channels.cache.get(await db.get(invite.guild.id)).send({ embeds: [new discord.MessageEmbed().setTitle('Se ha eliminado una invitación ya existente.').addFields({ name: 'Código', value: invite.code, inline: true }).setColor('RANDOM').setTimestamp()] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
}
