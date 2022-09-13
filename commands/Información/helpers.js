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
    run(bot, msg) {
        try {
            let embed = new discord.MessageEmbed();
            embed.setAuthor({ name: 'Agradecimientos', iconURL: 'https://i.imgur.com/OdsHvg5.png' })
            embed.setDescription(`¡Gracias a estas personas por aportar en el desarrollo de Moonlight!`)
            embed.addField('~ Desarrollador', `> \`${bot.application.owner.tag}\``)
            embed.addField('~ Ayudantes', `> \`${bot.users.cache.get('356461130560045067').username}#${bot.users.cache.get('356461130560045067').discriminator}\`: Por enseñarme a hacer un command handler.\n> \`${bot.users.cache.get('799841175569170444').username}#${bot.users.cache.get('799841175569170444').discriminator}\`: Por ayudarme a hacer algunos comandos en la beta de Moonlight.`)
            embed.addField('~ Testers', `> \`${bot.users.cache.get('759978790734004235').username}#${bot.users.cache.get('759978790734004235').discriminator}\`\n> \`${bot.users.cache.get('780208469092859961').username}#${bot.users.cache.get('780208469092859961').discriminator}\`\n> \`${bot.users.cache.get('517729180054716416').username}#${bot.users.cache.get('517729180054716416').discriminator}\``)
            embed.setFooter({ text: bot.user.username, iconURL: bot.user.displayAvatarURL() })
            embed.setColor(bot.application.color);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
