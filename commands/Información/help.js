let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fs = require('fs');
module.exports = new Command({
    name: 'help',
    description: 'Recibe información sobre los comandos disponibles de Moonlight.',
    cooldown: 3,
    aliases: ['h', 'ayuda'],
    category: 'Información',
    usage: '[comando]',
    example: 'botinfo',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            let embed = new discord.MessageEmbed();
            if(!args[1]) {
                let categories = [];
                fs.readdirSync('./commands/').forEach(dir => {
                    if(['Desarrollador'].includes(dir)) return;
                    const cmds = fs.readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js')).map(command => {
                        let file = require(`../../commands/${dir}/${command}`);
                        if(!file.name) return `...`;
                        return `\`${file.name.replace('.js', '')}\``;
                    });
                    let object = new Object();
                    object = {
                        name: `~ ${dir.toString()} (${fs.readdirSync(`./commands/${dir}/`).filter(f => f.endsWith('.js')).length})`,
                        value: cmds.length === 0 ? 'No hay comandos.' : cmds.join(', ')
                    };
                    categories.push(object);
                });
                let button = new discord.MessageActionRow().addComponents(
                    new discord.MessageButton()
                    .setLabel('¡Invitame!')
                    .setStyle('LINK')
                    .setURL(bot.application.url)
                    .setEmoji('🌝'),
                    new discord.MessageButton()
                    .setLabel('Top.gg')
                    .setStyle('LINK')
                    .setURL(`https://top.gg/bot/${bot.user.id}`)
                    .setEmoji('<:topgg:968716818581712967>'));

                embed.setColor(bot.application.color)
                embed.setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL() })
                embed.setTitle('Lista de comandos:')
                embed.setDescription(`**-** Para más información de un comando, escribe \`${prefix}${this.name} comando\`\n**Prefix:** !!\n**Prefix in-server:** ${prefix}`)
                embed.addFields(categories)
                embed.setFooter({ text: msg.guild.name, iconURL: msg.guild.iconURL({ dynamic: true }) });
                return msg.reply({ embeds: [embed], components: [button] });
            } else {
                let cmd = bot.cmds.get(args[1]) || bot.cmds.get(bot.aliases.get(args[1]));
                if(!cmd) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no se encontró el comando \`${args[1]}\`.`);
                if(cmd.category === 'Desarrollador' && ![bot.application.owner.id, bot.application.dev.id].includes(msg.author.id)) return;
                embed.setTitle(`Información sobre el comando \`${cmd.name}\``)
                embed.setColor(bot.application.color)
		embed.addFields(
		    { name: '• Nombre', value: cmd.name },
		    { name: '• Descripción', value: cmd.description },
		    { name: '• Uso', value: cmd.usage ? `${prefix}${cmd.name} ${cmd.usage}` : 'No hay uso.' },
		    { name: '• Ejemplo', value: cmd.example ? `${prefix}${cmd.name} ${cmd.example}` : 'No hay ejemplo.' },
		    { name: '• Cooldown', value: `${cmd.cooldown} segundos` },
		    { name: '• Alias', value: !cmd.aliases ? 'No hay alias.' : cmd.aliases.join(', ') },
		    { name: '• Habilitado (global)', value: cmd.enabled ? 'Sí' : 'No' },
		)
                embed.setFooter({ text: `<> Obligatorio, [] Opcional | No uses estos símbolos al usar el comando`, iconURL: bot.user.displayAvatarURL() });
                return msg.reply({ embeds: [embed] });
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
