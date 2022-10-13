let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'accept-menu',
    description: 'Acepta sugerencias o reportes',
    cooldown: 3,
    category: 'Desarrollador',
    usage: '<--s/--r> ID | Texto | Sugerencia de la persona',
    example: '--s 0000000000000000000 | Hola | Sugerencia/Reporte',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe **--s** para sugerencias o **--r** para reportes.`);
            if(!['--s', '--r'].includes(args[1])) return msg.channel.send(`Valor no válido`);

            if(!args[2]) return msg.channel.send(`Escribe la ID del usuario al que le quieres responder.\n**Uso:** ${prefix}${this.name} ${this.usage}`);
            let user = await getUser(args[2]);
            if(!user) return msg.channel.send(`Ese usuario no existe.`);
            if(!args[3]) return msg.channel.send(`Escribe un texto para el usuario\n**Uso:** ${prefix}${this.name} ${this.usage}`);
            if(!args[4]) return msg.channel.send(`Escribe la sugerencia o reporte que envió el usuario\n**Uso:** ${prefix}${this.name} ${this.usage}`);

            let embed = new discord.EmbedBuilder();
            if(args[1] === '--s') {
                args = args.slice(2).join(' ').split('|');
                embed.setColor('Green')
                embed.setTimestamp()
                embed.setAuthor({ name: '¡Tu sugerencia fue aceptada!', iconURL: bot.user.displayAvatarURL() })
                embed.setDescription(`**¡Felicidades ${user.username}!**, tu sugerencia a Moonlight fue aceptada. El staff te dejó un mensaje.\n**Staff:** ${args[1]}\n\n> Tu sugerencia fue el siguiente:\n\`\`\`\n${args[2]}\n\`\`\``);
            } else if(args[1] === '--r') {
                args = args.slice(2).join(' ').split('|');
                embed.setColor('Green')
                embed.setTimestamp()
                embed.setAuthor({ name: '¡Tu reporte fue solucionado!', iconURL: bot.user.displayAvatarURL() })
                embed.setDescription(`**¡Felicidades ${user.username}!**, el reporte a Moonlight que enviaste ya fue solucionado. El staff te dejó un mensaje.\n**Staff:** ${args[1]}\n\n> Tu reporte fue el siguiente:\n\`\`\`\n${args[2]}\n\`\`\``);
            }
            try {
                await user.send({ embeds: [embed] }).then(() => msg.reply(`${bot.getEmoji('check')} Mensaje enviado exitosamente!`));
            } catch (error) {
                msg.reply(`Hubo un error al intentar enviar el mensaje al usuario ${user.tag}.\n\`${error}\``);
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
