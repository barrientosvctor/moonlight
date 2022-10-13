let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'emoji',
    description: 'Administra los emojis de tu servidor con este comando!',
    cooldown: 3,
    category: 'Utilidades',
    usage: '<add / remove / rename> <emoji>',
    example: 'remove RappiHappu',
    enabled: true,
    botPerms: ['ManageEmojisAndStickers'],
    memberPerms: ['ManageEmojisAndStickers'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe alguna de la siguientes opciones:\n\`add\`: Añade un nuevo emoji al servidor.\n\`remove\`: Elimina un emoji del servidor.\n\`rename\`: Cambia el nombre de un emoji del servidor.`);
            if(!['add', 'remove', 'rename'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida!`);

            if(args[1] === 'add') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el nombre del emoji que vas a añadir.`);

		/** @type {Array<discord.Emoji | null> | null} */
		let emojiRoleRestricted;

		// if(!args.slice(3).join(' ')) emojiRoleRestricted = null;
		// else {
		//     for (const role in args[++3]) {
		// 	msg.channel.send(role);
		// 	// const validRole = getRole(role);
		// 	// if(!validRole) msg.channel.send(`El rol ${role} no existe en el servidor.`);
		// 	//
		// 	// emojiRoleRestricted.push(validRole);
		//     }
		// }
                if(msg.attachments.size === 0) return msg.channel.send(`Adjunta al mensaje el archivo del emoji que vas a añadir al servidor.`);
                else {
                    await msg.guild.emojis.create({ attachment: msg.attachments.first().url, name: args[2], reason: `Emoji añadido por ${msg.author.tag}`, roles: [] }).then(emoji => {
                        msg.reply({ embeds: [new discord.EmbedBuilder().setDescription(`${bot.getEmoji('check')} Muy bien! El emoji ${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`} fue añadido correctamente al servidor.\n\n**Nombre:** ${emoji.name}\n**ID:** ${emoji.id}\n**¿Animado?** ${emoji.animated ? `Sí.` : `No.`}\n**Añadido por:** ${msg.author}`).setColor('Green').setImage(emoji.url).setTimestamp()] });
                    }).catch(error => msg.channel.send(`Hubo un error al intentar añadir el emoji al servidor.\n\`${error}\``));
                }
            } else if(args[1] === 'remove') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el nombre del emoji que vas a eliminar del servidor.`);

                const emoji = msg.guild.emojis.cache.find(e => e.name === args[2]) || msg.guild.emojis.cache.find(e => e.name === args[2].split(':')[1]);
                if(!emoji) return msg.channel.send(`${bot.getEmoji('error')} El emoji **${args[2]}** no existe en el servidor, asegurate de escribir bien su nombre.`);

                await emoji.delete().then(emoji => msg.reply(`${bot.getEmoji('check')} El emoji *${emoji.name}* acaba de ser eliminado del servidor.`)).catch(err => msg.channel.send(`Ocurrió un error mientras que se eliminaba el emoji: \`${err}\``));
            } else if(args[1] === 'rename') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el nombre del emoji que va a ser cambiado de nombre.`);

                const emojii = msg.guild.emojis.cache.find(e => e.name === args[2]) || msg.guild.emojis.cache.find(e => e.name === args[2].split(':')[1]);
                if(!emojii) return msg.channel.send(`${bot.getEmoji('error')} El emoji **${args[2]}** no existe en el servidor, asegurate de escribir bien su nombre.`);
                if(!args[3]) return msg.channel.send(`**${msg.author.username}**, escribe el nuevo nombre que tendrá el emoji *${emojii.name}*`);

                await emojii.edit({ name: args[3], reason: `Emoji modificado por: ${msg.author.tag}` }).then(emoji => msg.reply(`${bot.getEmoji('check')} El emoji *${args[2]}* ha sido cambiado de nombre a **${emoji.name}** éxitosamente!`));
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
