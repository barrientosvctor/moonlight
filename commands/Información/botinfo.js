let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fs = require('fs');
module.exports = new Command({
    name: 'botinfo',
    description: 'Muestra iformación del bot.',
    cooldown: 3,
    aliases: ['bot'],
    category: 'Información',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix) {
        try {
            return msg.reply({ embeds: [new discord.EmbedBuilder().setThumbnail(bot.user.displayAvatarURL()).setColor(bot.application.color).setDescription(`> __Información general__\n**Servidores:** ${bot.guilds.cache.size}\n**Comandos:** ${bot.cmds.size}\n**Categorías:** ${fs.readdirSync('./commands/').length}\n**Fecha de creación:** <t:${Math.ceil(bot.user.createdTimestamp / 1000)}>\n**Prefix predeterminado:** m!\n**Prefix in-server:** ${prefix}\n**Conectado desde:** <t:${Math.ceil(bot.readyTimestamp / 1000)}:R>\n\n> __Latencia__\n**Bot:** ${Date.now() - msg.createdTimestamp}ms\n**WebSocket:** ${bot.ws.ping}ms\n\n> __Desarrollo__\n**Desarrollador:** ${bot.application.owner.tag}\n**Lenguaje:** JavaScript\n**Dependencias:** ${Object.keys(require('../../package.json').dependencies).length}\n**Versión:** v${require('../../package.json').version}\n**Librería:** discord.js${require('../../package.json').dependencies['discord.js']}\n**Node.js:** ${process.version}`).setFooter({ text: `Pedido por: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ extension: "png" }) })] });
        } catch (err) {
            bot.err(`Hubo un error al intentar obtener los datos del bot.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
