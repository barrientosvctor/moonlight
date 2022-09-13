let Command = require('../../base/models/Command'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Command({
    name: 'prefix',
    description: 'Establece un nuevo prefix para Moonlight en su servidor.',
    cooldown: 3,
    aliases: ['prefijo'],
    category: 'Configuración',
    usage: '<nuevo prefix>',
    example: '!!',
    enabled: true,
    memberPerms: ['MANAGE_GUILD'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe un nuevo prefix para el bot.`);
            if(args[1].length > 4) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, el nuevo prefix no debe ser mayor a 4 carácteres.`);
            let db = new database('./databases/prefix.json');

            if(args[1] === 'm!') {
                if(db.has(`${msg.guildId}`)) {
                    db.delete(`${msg.guildId}`);
                    return msg.reply(`${bot.getEmoji('check')} Mi prefix a sido reiniciado a **m!**`);
                } else return msg.channel.send(`**${msg.author.username}**, mi prefix predeterminado ya era **m!**`);
            } else if(args[1] === prefix) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ya tengo establecido ese prefix.`);
            else {
                db.set(`${msg.guildId}`, args[1]);
                return msg.reply(`${bot.getEmoji('check')} Mi prefix ha sido establecido a **${args[1]}**`);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar cambiar el prefix del bot.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
