let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'poll',
    description: 'Crea una encuesta.',
    cooldown: 3,
    aliases: ['encuesta'],
    category: 'Utilidades',
    usage: 'pregunta aquí | opción 1 | opción 2 | opción 3 | etc... | ...',
    example: '¿En que consola juegas? | PS2 | PS3 | PS4 | Xbox 360 | Xbox One',
    enabled: true,
    botPerms: ['ADD_REACTIONS'],
    memberPerms: ['MANAGE_CHANNELS'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            let pollReactions = {
                1: '🇦',
                2: '🇧',
                3: '🇨',
                4: '🇩',
                5: '🇪',
                6: '🇫',
                7: '🇬',
                8: '🇭',
                9: '🇮'
            }
            args = args.slice(1).join(' ').split('|');
            if(args.length < 3) return msg.channel.send(`${bot.getEmoji('noargs')} Te faltan argumentos para empezar una encuesta, sigue el ejemplo que te dejo abajo.\n**Uso:** \`${prefix}${this.name} ${this.usage}\`\n**Ejemplo:** \`${prefix}${this.name} ${this.example}\``);
            if(args.length > 10) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, no puedes hacer una encuesta con más de 9 opciones, intentaste poner ${args.length - 1} opciones.`);
            let result = ``,
            embed = new discord.MessageEmbed();
            result = args.slice(1).map((c, i) => {
                return `${pollReactions[i+1]}: ${c}`;
            });
            embed.setAuthor({ name: msg.author.username, iconURL: msg.author.displayAvatarURL({ dynamic: true }) })
            embed.setFooter({ text: msg.guild.name, iconURL: msg.guild.iconURL({ dynamic: true }) })
            embed.setColor('RANDOM')
            embed.setTimestamp()
            embed.setDescription(`📊 **${args[0]}**\n${result.join('\n')}`);
            msg.channel.send({ embeds: [embed] }).then(m => {
                args.map(async i => {
                    await m.react(`${pollReactions[i+1]}`);
                });
            }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar crear la encuesta:\n\`${error}\``));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});