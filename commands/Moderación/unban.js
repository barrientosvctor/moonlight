let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'unban',
    description: 'Le quita el ban a un usuario baneado del servidor.',
    cooldown: 3,
    category: 'Moderación',
    usage: '<@usuario | ID> [motivo]',
    example: '@Ben#0001 Ban quitado',
    enabled: true,
    botPerms: ['BanMembers'],
    memberPerms: ['BanMembers'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del usuario a desbanear.`);
            
            /** @type {discord.User} */
            let user = await getUser(args[1]);
            let motivo = args.slice(2).join(' '),
            embed = new discord.EmbedBuilder();

            if(!user) return msg.channel.send(`${bot.getEmoji('error')} Ese usuario no existe en Discord.`);
            if(!motivo) motivo = 'No se dio motivo';
            if(motivo.length >= 511) motivo = motivo.slice(0, 508) + '...';

            if(user === msg.member.user) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no te puedes desbanear a ti mismo.`);
            if(user === msg.guild.members.me.user) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no me puedo desbanear ya que no lo estoy.`);

            try {
                await msg.guild.members.unban(user.id, motivo);
                return msg.reply(`> ${bot.getEmoji('check')} **${user.tag}** fue desbaneado éxitosamente del servidor.`);
            } catch (error) {
                return msg.channel.send(`> ${bot.getEmoji('error')} **${user.tag}** no ha sido baneado anteriormente en el servidor.`)
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
