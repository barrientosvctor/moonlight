let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'forceban',
    description: 'Banea a cualquier usuario de Discord aunque no esté en el servidor.',
    cooldown: 3,
    category: 'Moderación',
    usage: '<@usuario | ID> [motivo]',
    example: '@George#0001 Motivo aquí',
    enabled: true,
    botPerms: ['BanMembers'],
    memberPerms: ['BanMembers'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID de un usuario de Discord para banearlo del servidor.`);
            
            /** @type {discord.User} */
            const user = await getUser(args[1]);
            let motivo = args.slice(2).join(' '),
            embed = new discord.EmbedBuilder();

            if(!user) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese usuario no existe en Discord.`);
            if(!motivo) motivo = 'No se dio motivo.';
            if(motivo.length >= 511) motivo = motivo.slice(0, 508) + '...';

            if(user === msg.member.user) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no te puedes banear a ti mismo.`);
            if(user === msg.guild.members.me.user) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no me puedes banear del servidor con mis comandos.`);

            await msg.guild.members.ban(user.id, { reason: motivo }).then(() => {
                return msg.reply(`> ${bot.getEmoji('check')} **${user.tag}** (\`${user.id}\`) ha sido forzadamente baneado del servidor.`);
            }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar banear al usuario del servidor:\n\`${error}\``));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
