let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'channelinfo',
    description: 'Muestra información sobre un canal del servidor.',
    cooldown: 3,
    aliases: ['channel', 'canal', 'chinfo'],
    category: 'Información',
    usage: '[#canal | ID]',
    example: '#General',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            let channel = getChannel(args[1]) || msg.guild.channels.cache.find(ch => ch.name === args[1]) || msg.channel;
            if(!channel) return msg.channel.send(`${bot.getEmoji('error')} El canal ${args[1]} no existe en el servidor.`);
            
            /** @type {String} */
            let info,
            embed = new discord.MessageEmbed();
            switch (channel.type) {
                case 'GUILD_TEXT':
                    info = `**Descripción:** ${channel.topic ? channel.topic : 'Ninguno'}\n**NSFW:** ${channel.nsfw ? 'Sí' : 'No'}\n**Modo lento:** ${channel.rateLimitPerUser > 0 ? 'Activado' : 'Desactivado'}`;
                break;
                case 'GUILD_VOICE':
                    info = `**Tasa de bits:** ${channel.bitrate}\n**Límite de usuarios:** ${channel.userLimit}`;
                break;
            }
            embed.setTitle(`Información del canal #${channel.name}`)
            embed.setDescription(`**Nombre:** ${channel.name}\n**ID:** ${channel.id}\n**Posición:** ${channel.rawPosition}\n${info}`)
            embed.setColor('RANDOM')
            embed.setTimestamp();
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});