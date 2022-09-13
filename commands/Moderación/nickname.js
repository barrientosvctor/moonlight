const Log = require('../../base/classes/Log');
let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'nickname',
    description: 'Cambia el apodo a un miembro del servidor.',
    cooldown: 3,
    aliases: ['nick', 'username'],
    category: 'Moderación',
    usage: '<set / remove> <@miembro | ID> <apodo>',
    example: 'set @Harris#0001 Harry',
    enabled: true,
    botPerms: [''],
    memberPerms: [],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`set\`: Establece un apodo a un miembro.\n\`remove\`: Le quita el apodo actual a un miembro.`);
            if(!['set', 'remove'].includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} Opción no válida.`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del miembro que le vas a cambiar el apodo.`);

            /** @type {discord.GuildMember} */
            let member = getMember(args[2]),
            embed = new discord.MessageEmbed();

            if(args[1] === 'set') {
                if(!args[3]) return msg.channel.send(`**${msg.author.username}**, escribe el nuevo apodo que tendrá ${member.user.username}.`);
                await member.setNickname(args.slice(3).join(' ')).then(() => {
                    return msg.reply(`> ${bot.getEmoji('check')} Ahora el apodo de ${member.user.tag} es **${member.nickname}**`);
                }).catch(error => msg.channel.send(`Ocurrió un error al intentar cambiar el apodo:\n\`${error}\``));
            } else {
                if(!member.nickname) return msg.channel.send(`${bot.getEmoji('error')} **${member.user.tag}** no tenía un apodo establecido.`);
                await member.setNickname(member.user.username).then(() => {
                    return msg.channel.send(`> ${bot.getEmoji('check')} El apodo de **${member.user.tag}** ha sido removido.`);
                }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar remover el apodo:\n\`${error}\``));
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});