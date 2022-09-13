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
            let media = bot.checkAttachments(msg);
            let row = new discord.MessageActionRow().addComponents(
                new discord.MessageButton()
                .setStyle('PRIMARY')
                .setCustomId('si')
                .setLabel('Sí'),
                new discord.MessageButton()
                .setStyle('DANGER')
                .setCustomId('no')
                .setLabel('No'))
                let confirm = await msg.reply({ content: `¿Estás seguro de que quieres enviar este reporte?`, components: [row] }),
                collector = confirm.createMessageComponentCollector({ filter: (m) => m.user.id === msg.author.id, max: 1, maxUsers: 1, componentType: 'BUTTON', time: 20000 });
                collector.once('collect', async r => {
                    if(r.customId === 'si') {
                        bot.channels.cache.get('948377262032572436').send({ embeds: [new discord.MessageEmbed().setColor('RED').setFooter({ text: `Reporte enviado por: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) }).setTitle('¡Un nuevo reporte ha llegado!').setDescription(`**Reportador:** ${msg.author} (\`${msg.author.id}\`)\n**Contenido del reporte:** ${args.slice(1).join(' ')}`).addField('Adjuntos', `${media}`)] }).then(() => {
                            confirm.edit({ content: `Tu reporte ha sido enviado con éxito. Recuerda tener tus mensajes privados abiertos para avisarte el estado de tu reporte.`, components: [] });
                        }).catch(err => {
                            confirm.edit({ content: 'Ha ocurrido un error al enviar tu reporte. Por favor, inténtalo de nuevo más tarde.', components: [] });
                            bot.logs.send(`Ocurrió un error al intentar enviar el reporte de un usuario: \`${err}\``);
                        });
                    } else {
                        confirm.edit({ content: `Tu reporte no ha sido enviado.`, components: [] });
                    }
                });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
