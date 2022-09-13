let Command = require('../../base/models/Command'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Command({
    name: 'logs',
    description: 'Activa o desactiva los registros de auditoría de Moonlight.',
    cooldown: 3,
    aliases: ['log'],
    category: 'Configuración',
    usage: '<set / delete>',
    example: 'set #Logs',
    enabled: false,
    botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    memberPerms: [],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`set\`: Establece el canal donde se enviarán los logs.\n\`delete\`: Elimina los logs del servidor.`);
            if(!['set', 'delete'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida.`);
            let db = new database('./databases/logs.json');

            if(args[1] === 'set') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del canal en donde se registrarán los logs.`);

                /** @type {discord.GuildChannel} */
                let channel = getChannel(args[2]);
                if(!channel) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese canal no existe.`);
                if(!channel.permissionsFor(msg.guild.me).has('VIEW_CHANNEL') || !channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) return msg.channel.send(`${bot.getEmoji('warning')} Me faltan alguno de los siguientes permisos para establecer los registros en ese canal:\n**-** **Ver canal**, **Enviar mensajes**, **Enviar Links**`);
                if(channel.id === await db.get(msg.guildId)) return msg.channel.send(`${bot.getEmoji('error')} No se puede establecer los registros en este canal porque ya están establecidos ahí.`);

                db.set(msg.guildId, channel.id);
                return msg.reply(`> ${bot.getEmoji('check')} Los registros han sido establecidos éxitosamente en el canal ${channel}.`);
            } else {
                if(db.has(msg.guildId)) {
                    db.delete(msg.guildId);
                    return msg.reply(`> ${bot.getEmoji('check')} Los registros fueron eliminados del servidor.`);
                } else return msg.reply(`> ${bot.getEmoji('error')} No se han establecido registros en el servidor.`);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
