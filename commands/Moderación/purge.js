let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'purge',
    description: 'Elimina la cantidad de mensa',
    cooldown: 3,
    aliases: ['clean', 'clear', 'prune', 'limpiar', 'borrar', 'purgar'],
    category: 'Moderación',
    usage: '<número>',
    example: '15',
    enabled: true,
    botPerms: ['ManageMessages'],
    memberPerms: ['ManageMessages'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el número de mensajes a eliminar`);
            if(isNaN(args[1])) return msg.channel.send(`${bot.getEmoji('error')} La cantidad de mensajes debe ser un número.`);
            if(args[1] < 1 || args[1] > 100) return msg.channel.send(`${bot.getEmoji('warning')} La cantidad de mensajes a eliminar debe ser entre **1** y **100** mensajes.`);
            if(args[1] >= 1 || args[1] <= 100) {
                if(msg.deletable) msg.delete().catch(() => {});
                msg.channel.bulkDelete(parseInt(args[1]), true).then(() => {
                    msg.channel.send(`${bot.getEmoji('check')} **${parseInt(args[1])}** mensajes eliminados éxitosamente.`).then(message => {
                        setTimeout(() => message.delete(), 5000);
                    }).catch(() => {});
                }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar eliminar mensajes:\n\`${error}\``));
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
