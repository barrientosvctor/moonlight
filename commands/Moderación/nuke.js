let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'nuke',
    description: 'Una limpieza total del chat mencionado',
    cooldown: 10,
    aliases: ['nukear'],
    category: 'Moderación',
    usage: '[#canal | ID]',
    enabled: true,
    botPerms: ['MANAGE_CHANNELS'],
    memberPerms: ['MANAGE_GUILD'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            /** @type {discord.GuildChannel} */
            let channel = getChannel(args[1]) || msg.channel;

            if(!channel.deletable) return msg.channel.send(`${bot.getEmoji('error')} Para seguir con el comando tengo que tener permisos para eliminar el canal.`);
            let row = new discord.MessageActionRow().addComponents(
                new discord.MessageButton()
                .setStyle('PRIMARY')
                .setCustomId('si')
                .setLabel('Sí'),
                new discord.MessageButton()
                .setStyle('DANGER')
                .setCustomId('no')
                .setLabel('No')),
            confirmMsg = await msg.channel.send({ content: `¿Estás seguro de hacer esto ${msg.author.username}? *Tienes 20 segundos para responder*`, components: [row] }),
            collector = confirmMsg.createMessageComponentCollector({ filter: (m) => m.user.id === msg.author.id, max: 1, maxUsers: 1, componentType: 'BUTTON', time: 20000 });

            collector.on('collect', res => {
                if(res.customId === 'si') {
                    channel.clone().then(ch => {
                        ch.setParent(channel.parent);
                        ch.setPosition(channel.position);
                        channel.delete().then(() => {
                            let att = new discord.MessageAttachment('https://imgur.com/LIyGeCR.gif', 'nuke.gif');
                            return ch.send({ content: '**El canal ha explotado el mil pedazos...**', files: [att] });
                        }).catch(error => {});
                    }).catch(error => msg.channel.send(`${bot.getEmoji('warning')} Ocurrió un error al intentar nukear el canal:\n\`${error}\``));
                } else {
                    confirmMsg.edit({ content: `${bot.getEmoji('error')} Acción cancelada.`, components: [] });
                }
            });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});