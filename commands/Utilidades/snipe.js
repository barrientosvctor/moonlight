let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'snipe',
    description: 'Muestra el último mensaje eliminado del canal.',
    cooldown: 3,
    category: 'Utilidades',
    usage: '[#canal | ID]',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            /** @type {discord.GuildChannel} */
            let channel = getChannel(args[1]) || msg.channel,
            message = bot.snipes.get(channel.id),
            embed = new discord.MessageEmbed();

            function trim(value) {
                return value.length > 2010 ? `${value.slice(0, 2006)}...` : value;
            }

            if(!message) return msg.reply(`${bot.getEmoji('error')} No hay mensajes recientemente eliminados en ${channel}.`);
            else {
                embed.setColor('RANDOM')
                embed.setDescription(`¡Un mensaje de ${message.author} ha sido recientemente eliminado en ${channel}!`)
                embed.addField('Contenido', message.content ? trim(message.content) : '*mensaje desconocido*')
                embed.addField('Fecha y hora', `<t:${Math.ceil(message.time / 1000)}> (<t:${Math.ceil(message.time / 1000)}:R>)`)
                if(message.image) embed.setImage(message.image);
                msg.reply({ embeds: [embed] });
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});