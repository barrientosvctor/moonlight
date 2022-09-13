let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = {
    name: 'inviteCreate',
    /**
    * @param {Moonlight} bot
    * @param {discord.Invite}
    *
    */
    async run(bot, invite) {
        try {
            let db = new database('./databases/logs.json');
            if(db.has(invite.guild.id)) {
                bot.channels.cache.get(await db.get(invite.guild.id)).send({ embeds: [new discord.MessageEmbed().setTitle('Enlace de invitación creado.').setDescription(`Acaba de crearse una invitación en el canal ${invite.channel}`).addFields({ name: 'Código', value: invite.code, inline: true }, { name: 'Máximo de usos', value: invite.maxUses !== 0 ? invite.maxUses.toString() : 'Ilimitado', inline: true }, { name: '¿Permanente?', value: invite.maxAge < 1 ? 'Sí' : 'No', inline: true }, { name: '¿Temporal?', value: invite.temporary ? 'Sí' : 'No', inline: true }).setColor('RANDOM').setTimestamp()] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
}
