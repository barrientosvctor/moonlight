const Moonlight = require('../base/Moonlight');
const discord = require('discord.js');
const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { ApplicationCommandType } = require('discord-api-types/v9');

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName("Avatar")
    .setType(ApplicationCommandType.User),
    /**
    * @param {Moonlight} bot
    * @param {discord.ContextMenuInteraction} int
    */
    async run(bot, int) {
	try {
	    /** @type {discord.GuildMember} */
	    let member = int.guild.members.cache.get(int.targetId),
		embed = new discord.MessageEmbed();

            embed.setDescription(`Avatar de ${member.user.tag}\n[PNG](${member.user.displayAvatarURL({ size: 2048, format: 'png' })}) | [JPG](${member.user.displayAvatarURL({ size: 2048, format: 'jpg' })}) | [WEBP](${member.user.displayAvatarURL({ size: 2048, format: 'webp' })}) ${member.user.avatar.startsWith('a_') ? `| [GIF](${member.user.displayAvatarURL({ size: 2048, format: 'gif', dynamic: true })})` : ``}\n[Búscalo en Google](https://www.google.com/searchbyimage?image_url=${member.user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true })})`)
            embed.setImage(member.user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true }))
            embed.setFooter({ text: `Pedido por: ${int.user.tag}`, iconURL: int.user.displayAvatarURL({ dynamic: true }) })
            embed.setColor('RANDOM');
	    return int.editReply({ embeds: [embed] });
	} catch (err) {
	    console.error(err);
	}
    }
}
