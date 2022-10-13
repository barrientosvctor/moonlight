let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'bugreport',
    description: 'Reporta un bug que tenga Moonlight para así mejorarlo.',
    cooldown: 3,
    aliases: ['botreport', 'report'],
    category: 'Información',
    usage: '<reporte>',
    example: 'Hay bugs.',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe a detalle el bug que vayas a reportar de Moonlight.\nP.D: Para enviar un reporte tienes que adjuntar archivos que evidencien el bug.`);
            //if(msg.attachments.size === 0) return msg.channel.send(`**${msg.author.username}**, recuerda adjuntar archivos para enviar un reporte.`);
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
                let confirm = await msg.reply({ content: `¿Estás seguro de que quieres enviar este reporte?`, components: [row] }),
                collector = confirm.createMessageComponentCollector({ filter: (m) => m.user.id === msg.author.id, max: 1, maxUsers: 1, componentType: discord.ComponentType.Button, time: 20000 });
                collector.once('collect', async r => {
                    if(r.customId === 'si') {
                        bot.logs.send({ embeds: [new discord.EmbedBuilder().setColor('Red').setFooter({ text: `Reporte enviado por: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ extension: 'png' }) }).setTitle('¡Un nuevo reporte ha llegado!').setDescription(`**Reportador:** ${msg.author} (\`${msg.author.id}\`)\n**Contenido del reporte:** ${args.slice(1).join(' ')}`).addFields({ name: 'Adjuntos', value: msg.attachments.map(p => p.url).join('\n') || 'No se adjuntó nada' })] }).then(() => {
                            confirm.edit({ content: `${bot.getEmoji('check')}Tu reporte ha sido enviado con éxito. Recuerda tener tus mensajes privados abiertos para avisarte el estado de tu reporte.`, components: [] });
                        }).catch(err => {
                            confirm.edit({ content: 'Ha ocurrido un error al enviar tu reporte. Por favor, inténtalo de nuevo más tarde.', components: [] });
                            bot.logs.send(`Ocurrió un error al intentar enviar el reporte de un usuario: \`${err}\``);
                        });
                    } else {
                        confirm.edit({ content: `${bot.getEmoji('error')} Tu reporte no ha sido enviado.`, components: [] });
                    }
                });

	    	collector.once('end', (collected, reason) => {
		    // console.log({ collected, reason });
		    if(reason === 'limit') return;
		    if(reason === 'time') confirm.edit({ content: `${bot.getEmoji('error')} El reporte fue cancelado por inactividad.`, components: [] });
		});
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
