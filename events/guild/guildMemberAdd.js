let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'guildMemberAdd',
    /** @param {discord.GuildMember} member */
    async run(bot, member) {
        try {
	    let embed = new discord.EmbedBuilder();

            // Autorole code
            const autorole_db = new database('./databases/autorole.json');
            if(autorole_db.has(`autorole_user-${member.guild.id}`) || autorole_db.has(`autorole_bot-${member.guild.id}`)) {
                if(member.user.bot) await member.roles.add(await autorole_db.get(`autorole_bot-${member.guild.id}`)).catch(() => {});
                else await member.roles.add(await autorole_db.get(`autorole_user-${member.guild.id}`)).catch(() => {});
            }

	    // Entrada usuario a servidor
	    const logs_db = new database('./databases/logs.json');
	    if(logs_db.has(member.guild.id)) {
		embed
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL({ size: 2048, extension: 'png' }))
		.setTitle(`¡${member.user.tag} ha entrado al servidor!`)
		.setDescription(`Creación de la cuenta: <t:${Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${Math.ceil(member.user.createdTimestamp / 1000)}:R>)`)
		.setColor('Green');
		bot.channels.cache.get(await logs_db.get(member.guild.id)).send({ embeds: [embed] });
	    }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
