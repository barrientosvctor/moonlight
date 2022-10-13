let Command = require('../../base/models/Command'),
discord = require('discord.js'),
ms = require('../../base/packages/ms'),
humanize = require('../../base/packages/humanize');
module.exports = new Command({
    name: 'slowmode',
    description: 'Establece un modo lento en el chat que menciones o en el que ejecutes el comando.',
    cooldown: 3,
    category: 'Moderación',
    usage: '[#canal | ID] <tiempo>',
    example: '1h',
    enabled: true,
    botPerms: ['ManageChannels'],
    memberPerms: ['ManageChannels'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            /** @type {discord.VoiceChannel} */
            const channel = getChannel(args[1]) || msg.channel;
            const time = getChannel(args[1]) ? args[2] : args[1]; 

            if(time === '0' || time === 'off') {
                if(channel.rateLimitPerUser < 1) return msg.channel.send(`${bot.getEmoji('error')} El canal ${channel} no tiene un modo lento establecido.`);

                await channel.setRateLimitPerUser(0).then(() => {
                    channel.send(`> ${bot.getEmoji('check')} El modo lento en el canal ha sido desactivado.`);
                }).catch(error => msg.channel.send(`> ${bot.getEmoji('warning')} Ocurrió un error al intentar quitar el cooldown en el canal:\n\`${error}\``));
            } else {
                if(!time) return msg.channel.send(`**${msg.author.username}**, especifica el tiempo de cooldown para el chat.`);
                if(time !== (`${parseInt(time.slice(0))}s`) && time !== (`${parseInt(time.slice(0))}m`) && time !== (`${parseInt(time.slice(0))}h`) && time !== (`${parseInt(time.slice(0))}d`) && time !== (`${parseInt(time.slice(0))}w`) && time !== (`${parseInt(time.slice(0))}y`)) return msg.channel.send(`**${msg.author.username}** escribe una duración válida. (10s/5m/1h/2w/1y)`);
                if(Math.ceil(ms(time) / 1000) > 21600) return msg.channel.send(`${bot.getEmoji('error')} El tiempo máximo de cooldown es de 6 horas.`);

                await channel.setRateLimitPerUser(Math.ceil(ms(time) / 1000)).then(() => {
                    return channel.send(`> ${bot.getEmoji('check')} El canal ha sido establecido con un cooldown de **${humanize(ms(time))}**`);
                }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar cambiar el cooldown del canal:\n\`${error}\``));
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
