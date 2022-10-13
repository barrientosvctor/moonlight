let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'botsuggest',
    description: 'Sugiere funcionalidades para el bot.',
    cooldown: 3,
    aliases: ['botsuggestion'],
    category: 'Información',
    usage: '<sugerencia>',
    example: 'Ejemplo de sugerencia',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe la sugerencia que quieres enviar para mejorar Moonlight.\nP.D: Recuerda que puedes adjuntar archivos para complementar mejor tu sugerencia.`);
            // let media = bot.checkAttachments(msg);
            let row = new discord.ActionRowBuilder().addComponents(
                new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Success)
                .setCustomId('si')
                .setLabel('Sí'),
                new discord.ButtonBuilder()
                .setStyle(discord.ButtonStyle.Danger)
                .setCustomId('no')
                .setLabel('No'))
                let confirm = await msg.reply({ content: `¿Estás seguro de que quieres enviar esta sugerencia?`, components: [row] }),
                collector = confirm.createMessageComponentCollector({ filter: (m) => m.user.id === msg.author.id, max: 1, maxUsers: 1, componentType: discord.ComponentType.Button, time: 20_000 });
            collector.once('collect', async res => { 
                if(res.customId === 'si') {
                    bot.logs.send({ embeds: [new discord.EmbedBuilder().setAuthor({ name: '¡Ha llegado una nueva sugerencia!', iconURL: bot.user.displayAvatarURL() }).setDescription(`Sugerencia enviada por ${msg.author} (\`${msg.author.id}\`)\n__Sugerencia:__ \`\`\`\n${args.slice(1).join(' ')}\n\`\`\``).addFields({ name: 'Adjuntos', value: msg.attachments.map(p => p.url).join('\n') || 'No se adjuntó nada' }).setFooter({ text: `Solicitud enviada por ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ extension: 'png' }) }).setColor('Random')] }).then(() => {
                        confirm.edit({ content: 'Tu sugerencia ha sido enviada con éxito! Asegúrate de tener activado los mensajes privados para avisarte el estado de tu sugerencia.', components: [] });
                    }).catch(err => {
                        confirm.edit({ content: 'Ha ocurrido un error al enviar tu sugerencia. Por favor, inténtalo de nuevo más tarde.', components: [] });
                        bot.logs.send(`Ocurrió un error al intentar enviar la sugerencia de un usuario: \`${err}\``);
                        console.error(err);
                    });
                } else confirm.edit({ content: 'Tu sugerencia no ha sido enviada.', components: [] });
            });

	    collector.once('end', (collected, reason) => {
		// console.log({ collected, reason });
		if(reason === 'limit') return;
		if(reason === 'time') confirm.edit({ content: `${bot.getEmoji('error')} La sugerencia fue cancelada por inactividad.`, components: [] });
	    });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
