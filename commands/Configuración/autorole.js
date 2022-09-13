let Command = require('../../base/models/Command'),
discord = require('discord.js'),
database = require('../../base/packages/database');

module.exports = new Command({
    name: 'autorole',
    description: 'Establece roles automáticos cada que un usuario o bot entra a su servidor.',
    cooldown: 3,
    category: 'Configuración',
    usage: '<set / delete / list> <user / bot> <@role | ID>',
    example: 'set bot @Bots',
    ownerOnly: false,
    nsfwOnly: false,
    enabled: true,
    botPerms: ['MANAGE_ROLES'],
    memberPerms: ['MANAGE_GUILD'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una de las siguientes opciones:\n\`set\`: Establece un nuevo rol automático en el servidor.\n\`delete\`: Elimina el rol ya establecido del servidor.\n\`list\`: Muestra los roles que han sido establecidos para cada tipo de usuario en el servidor.`);
            let db = new database('./databases/autorole.json'),
            embed = new discord.MessageEmbed(),
            dbValue;

            if(args[2] === 'user') dbValue = `autorole_user-${msg.guildId}`;
            else dbValue = `autorole_bot-${msg.guildId}`;

            if(args[1] === 'set') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe \`user\` o \`bot\` para especificar el tipo de usuario al que se le dará algún rol.`);
                if(!['user', 'bot'].includes(args[2])) return msg.channel.send(`${bot.getEmoji('error')} Tipo de usuario no válido.`);

                if(!args[3]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID del rol que le vas a asignar a los nuevos ${args[2] === 'user' ? 'usuarios' : 'bots'}.`)
                /**
                 * @type {discord.Role}
                 */
                let role = getRole(args[3]);
                if(!role) return msg.channel.send(`${bot.getEmoji('error')} Parece que ese rol no existe, prueba a usar otro.`);
                if(role.position >= msg.guild.me.roles.highest.position) return msg.channel.send(`**${msg.author.username}**, no puedo añadir este rol debido a que jerárquicamente tiene un puesto mayor o igual al mío.`);
                if(role.position >= msg.member.roles.highest.position) return msg.channel.send(`**${msg.author.username}**, no puedo añadir el rol ya que jerárquicamente tiene un puesto mayor o igual al tuyo!`);
                if(role.managed) return msg.channel.send(`${bot.getEmoji('warning')} No puedo asignar roles que estén administrados por una integración, prueba con otro.`);

                if(db.has(dbValue) && await db.get(dbValue) === role.id) return msg.reply(`${bot.getEmoji('error')} Este rol ya ha sido establecido anteriormente para los ${args[2] === 'user' ? 'usuarios' : 'bots'}, prueba con otro.`);
                else {
                    db.set(dbValue, role.id);
                    return msg.reply(`${bot.getEmoji('check')} A partir de ahora el rol **${role.name}** será otorgado a los ${args[2] === 'user' ? 'usuarios' : 'bots'} cada vez que entren al servidor.`);
                }
            } else if(args[1] === 'delete') {
                if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe \`user\` o \`bot\` para eliminar el rol que se le haya asignado (en caso de haber establecido uno).`);
                if(!db.has(dbValue)) return msg.reply(`${bot.getEmoji('error')} En el servidor no se ha asignado un rol para los ${args[2] === 'user' ? 'usuarios' : 'bots'}, para establecer uno haz uso del comando \`${prefix}${this.name} set ${args[2] === 'user' ? 'user' : 'bot'}\``);
                else {
                    db.delete(dbValue);
                    return msg.reply(`${bot.getEmoji('check')} El rol ha sido eliminado éxitosamente.`);
                }
            } else if(args[1] === 'list') {
                embed.setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
                embed.setColor('RANDOM')
                embed.setTitle('Lista de roles')
                embed.addFields({ name: 'Usuario', value: db.has(`autorole_user-${msg.guildId}`) ? `<@&${await db.get(`autorole_user-${msg.guildId}`)}>` : 'Ninguno' }, { name: 'Bot', value: db.has(`autorole_bot-${msg.guildId}`) ? `<@&${await db.get(`autorole_bot-${msg.guildId}`)}>` : 'Ninguno' })
                embed.setFooter({ text: msg.guild.name, iconURL: msg.guild.iconURL({ dynamic: true }) });
                return msg.reply({ embeds: [embed] });
            } else return msg.reply(`${bot.getEmoji('error')} Opción no válida.`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar este comando.', { name: this.name, type: 'command', filename: this.filename, channel: msg.channel, err: err });
        }
    }
});
