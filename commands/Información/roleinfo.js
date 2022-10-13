let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'roleinfo',
    description: '',
    cooldown: 3,
    aliases: ['rinfo'],
    category: 'Información',
    usage: '<@rol | rol | ID>',
    example: '@Usuarios',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona, escribe su ID o escribe el nombre del rol que quieres tener información.`);
            
            /** @type {discord.Role} */
            const role = getRole(args[1]) || msg.guild.roles.cache.find(r => r.name === args.slice(1).join(' '));
            let embed = new discord.EmbedBuilder();
            if(!role) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese rol no pertenece a este servidor.`);
            embed.setColor(role.hexColor)
            embed.setAuthor({ name: `Información del rol [ @${role.name} ]`, iconURL: msg.guild.iconURL({ extension: 'png' }) })
            embed.setDescription(`**Nombre:** ${role.name}\n**ID:** ${role.id}\n**Color:** ${role.hexColor}\n**Miembros con este rol:** ${role.members.size}\n**¿Separado?** ${role.hoist ? 'Sí' : 'No'}\n**¿Administrado?** ${role.managed ? 'Sí' : 'No'}\n**¿Mencionable?** ${role.mentionable ? 'Sí' : 'No'}\n**¿Editable?** ${role.editable ? 'Sí' : 'No'}\n**Fecha de creación:** <t:${Math.ceil(role.createdTimestamp / 1000)}>`)
            embed.addFields({ name: 'Permisos', value: role.permissions.toArray().map(role => `${bot.utils.guild.roles.permissions[role]}`).join(', ') });
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar obtener los datos del rol.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
