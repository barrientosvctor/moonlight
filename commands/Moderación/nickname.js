const Log = require('../../base/classes/Log');
let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'nickname',
    description: 'Cambia el apodo a un miembro del servidor.',
    cooldown: 3,
    aliases: ['nick', 'username'],
    category: 'Moderación',
    usage: '<@miembro | ID> <apodo>',
    example: 'set @Harris#0001 Harry',
    enabled: true,
    botPerms: ['ManageNicknames'],
    memberPerms: ['ManageNicknames'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro que le vas a cambiar el apodo.`);

            /** @type {discord.GuildMember} */
            const member = getMember(args[1]);
	    if (!member) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese miembro no existe.`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el nuevo apodo que tendrá ${member.user.username}.`);
            let embed = new discord.EmbedBuilder();

            await member.setNickname(args.slice(2).join(' ')).then(() => {
                return msg.reply(`> ${bot.getEmoji('check')} Ahora el apodo de ${member.user.tag} es **${member.nickname}**`);
            }).catch(error => msg.channel.send(`Ocurrió un error al intentar cambiar el apodo:\n\`${error}\``));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
