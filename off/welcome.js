// COMMAND IN PROGRESS

let Command = require('../../base/models/Command'),
discord = require('discord.js'),
database = require('../../base/packages/database');
module.exports = new Command({
    name: 'welcome',
    description: 'Establece el mensaje de bienvenidas a los nuevos usuarios en el servidor.',
    cooldown: 3,
    aliases: ['greeting'],
    category: 'Configuración',
    usage: '<set / add / edit / remove / delete> <opción>',
    example: 'edit texto Hola',
    enabled: false,
    botPerms: ['SEND_MESSAGES', 'EMBED_LINKS'],
    memberPerms: ['MANAGE_GUILD'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`set\`: Establece las bienvenidas en un canal que el bot pueda ver.\n\`add\`: Agrega una parte del mensaje de la bienvenida.\n\`edit\`: Modifica el contenido de una opción ya previamente añadida.\n\`remove\`: Elimina una opción ya añadida.\n\`delete\`: Elimina el canal en donde fue añadido las bienvenidas.`);
            if(!['set', 'add', 'edit', 'remove', 'delete'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida.`);
            const db = new database('./databases/welcome.json');

            if(args[1] === 'set') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del canal en donde se enviarán las bienvenidas.`);

                /** @type {discord.GuildChannel} */
                const channel = getChannel(args[2]);
                if(!channel) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese canal no existe.`);
                if(!channel.permissionsFor(msg.guild.me).has('VIEW_CHANNEL') || !channel.permissionsFor(msg.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(msg.guild.me).has('EMBED_LINKS')) return msg.channel.send(`${bot.getEmoji('warning')} Me faltan alguno de los siguientes permisos para establecer los registros en ese canal:\n**-** **${bot.utils.guild.roles.permissions['VIEW_CHANNEL']}**, **${bot.utils.guild.roles.permissions['SEND_MESSAGES']}**, **${bot.utils.guild.roles.permissions['EMBED_LINKS']}**`);
                db.set(msg.guildId, {});
                console.log(db);
                return msg.reply(`> ${bot.getEmoji('check')} Muy bien! Ahora las bienvenidas serán notificadas por el canal ${channel}.`);
            } else if(args[1] === 'add') {
                db.set(msg.guildId, { [`${args[2]}`]: args.slice(3).join(' ') });
                console.log(db);
                console.log(await db.get(msg.guildId)['d']);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
