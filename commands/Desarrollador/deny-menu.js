let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'deny-menu',
    description: 'Rechaza sugerencias.',
    cooldown: 3,
    category: 'Desarrollador',
    usage: 'ID | Texto | Sugerencia de la persona',
    example: 'ID | Texto | Sugerencia de la persona',
    ownerOnly: true,
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`Escribe la ID del usuario a responder.`);
            let user = await getUser(args[1]),
            embed = new discord.MessageEmbed();
            if(!user) return msg.channel.send(`${bot.getEmoji('error')} Ese usuario no existe en Discord.`);
            if(!args[2] || args[2] !== '|') return msg.channel.send(`Agrega un **|** para seguir con el siguiente argumento.`);
            if(!args[3]) return msg.channel.send(`Escribe un mensaje como en respuesta a la sugerencia.`);
            if(!args[4]) return msg.channel.send(`Escribe la sugerencia del usuario ${user.tag}`);
            args = args.slice(1).join(' ').split('|');

            embed.setColor('RED')
            embed.setTimestamp()
            embed.setAuthor({ name: 'Tu sugerencia fue rechazada.', iconURL: bot.user.displayAvatarURL() })
            embed.setDescription(`**¡Oh no ${user.username}!** Lamento informarte que tu sugerencia fue rechazada, si gustas puedes sugerir otras funciones en un futuro. El staff te dejó un mensaje.\n**Staff:** ${args[1]}\n\n> Tu sugerencia fue la siguiente:\n\`\`\`\n${args[2]}\`\`\``);

            try {
                await user.send({ embeds: [embed] }).then(() => msg.reply(`${bot.getEmoji('check')} Mensaje enviado exitosamente!`));
            } catch (error) {
                return msg.reply(`${bot.getEmoji('error')} Hubo un error al intentar enviar su respuesta al usuario ${user.tag}.\n\`${error}\``);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});