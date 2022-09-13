let Moonlight = require('../../base/Moonlight'),
discord = require('discord.js'),
database = require('../../base/packages/database');

module.exports = {
    name: 'guildMemberAdd',
    /**
     * @param {Moonlight} bot
     * @param {discord.GuildMember} member
     */
    async run(bot, member) {
        try {
            // Autorole code
            let autorole_db = new database('./databases/autorole.json');
            if(autorole_db.has(`autorole_user-${member.guild.id}`) || autorole_db.has(`autorole_bot-${member.guild.id}`)) {
                if(member.user.bot) await member.roles.add(await autorole_db.get(`autorole_bot-${member.guild.id}`)).catch(err => {});
                else await member.roles.add(await autorole_db.get(`autorole_user-${member.guild.id}`)).catch(err => {});
            }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
}
