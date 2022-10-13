let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'unlock',
    description: 'Desbloquea el canal mencionado a los miembros del servidor.',
    cooldown: 3,
    aliases: ['unblock', 'desbloquear'],
    category: 'Moderación',
    usage: '[#canal | ID]',
    example: '#General',
    enabled: true,
    botPerms: ['ManageChannels', 'ManageRoles'],
    memberPerms: ['ManageChannels'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            /** @type {discord.GuildChannel} */
            const channel = getChannel(args[1]) || msg.channel;
            if(!channel) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese canal no pertenece al servidor.`);


	    if(channel.permissionsFor(msg.guild.roles.everyone).has('SendMessages' && 'AddReactions')) return msg.channel.send(`${bot.getEmoji('error')} El canal ${channel} no estaba bloqueado.`);

            await channel.permissionOverwrites.edit(msg.guild.roles.everyone, { 'SendMessages': true, 'AddReactions': true }).then(() => {
                return channel.send(`> ${bot.getEmoji('check')} ¡El canal ha sido desbloqueado!`);
            }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar bloquear el canal:\n${error}`));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
