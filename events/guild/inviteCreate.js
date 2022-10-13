let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'inviteCreate',
    /** @param {discord.Invite} invite */
    async run(bot, invite) {
        try {
            const db = new database('./databases/logs.json');
            if(db.has(invite.guild.id)) {
                bot.channels.cache.get(await db.get(invite.guild.id)).send({ embeds: [new discord.EmbedBuilder().setTitle('Enlace de invitación creado.').setDescription(`Acaba de crearse una invitación en el canal ${invite.channel}`).addFields({ name: 'Código', value: invite.code, inline: true }, { name: 'Máximo de usos', value: invite.maxUses !== 0 ? invite.maxUses.toString() : 'Ilimitado', inline: true }, { name: '¿Permanente?', value: invite.maxAge < 1 ? 'Sí' : 'No', inline: true }, { name: '¿Temporal?', value: invite.temporary ? 'Sí' : 'No', inline: true }).setColor('Random').setTimestamp()] });
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        } 
    }
});
