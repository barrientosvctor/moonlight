let Event = require('../../base/models/Event'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Event({
    name: 'guildMemberRemove',
    /** @param {discord.GuildMember} member */
    async run(bot, member) {
        try {
	    let embed = new discord.EmbedBuilder();

	    // Salida usuario del servidor
	    const logs_db = new database('./databases/logs.json');
	    if(logs_db.has(member.guild.id)) {
		embed
		.setTimestamp()
		.setThumbnail(member.user.displayAvatarURL({ size: 2048, extension: 'png' }))
		.setTitle(`${member.user.tag} se ha ido del servidor`)
		.setDescription(`Creación de la cuenta: <t:${Math.ceil(member.user.createdTimestamp / 1000)}> (<t:${Math.ceil(member.user.createdTimestamp / 1000)}:R>)`)
		.setColor('Red');
		bot.channels.cache.get(await logs_db.get(member.guild.id)).send({ embeds: [embed] });
	    }
        } catch (err) {
            bot.err({ name: this.name, type: 'event', filename: __filename, error: err });
        }
    }
});
