let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'helpers',
    description: 'Gracias a estas personas hemos podido crear este bot.',
    cooldown: 3,
    category: 'Información',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
	    let helpWilly = await bot.users.fetch('356461130560045067'),
		helpJar = await bot.users.fetch('799841175569170444'),
		testNapo = await bot.users.fetch('759978790734004235'),
		testPolisia = await bot.users.fetch('780208469092859961');

            const embed = new discord.EmbedBuilder();
            embed.setAuthor({ name: 'Agradecimientos', iconURL: 'https://i.imgur.com/OdsHvg5.png' })
            embed.setDescription(`¡Gracias a estas personas por aportar en el desarrollo de Moonlight!`)
	    embed.addFields(
		{
		    name: '~ Desarrollador',
		    value: `> \`${bot.application.owner.tag}\``
		},
		{
		    name: '~ Ayudantes',
		    value: `> \`${helpWilly.tag}\`: Por enseñarme a hacer un command handler.\n> \`${helpJar.tag}\`: Por ayudarme a hacer algunos comandos en la beta de Moonlight.`
		},
		{
		    name: '~ Testers',
		    value: `> \`${testNapo.tag}\`\n> \`${testPolisia.tag}\``
		},
	    )
            embed.setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL() })
            embed.setColor(bot.application.color);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
