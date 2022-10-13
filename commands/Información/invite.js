let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'invite',
    description: 'Invita el bot a tu servidor con este comando.',
    cooldown: 3,
    aliases: ['inv', 'invitelink'],
    category: 'Información',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            return msg.reply({ embeds: [new discord.EmbedBuilder().setAuthor({ name: bot.user.username, iconURL: bot.user.displayAvatarURL() }).setColor('Random').setTitle('Enlace de invitación').setURL(bot.application.url).setDescription(`Me parece que quieres agregarme a tu servidor, lo puedes hacer pulsando el botón que está abajo. Gracias por considerar añadir a Moonlight a su servidor! :heart:`).setImage(bot.application.banner)], components: [new discord.ActionRowBuilder().addComponents(new discord.ButtonBuilder().setStyle(discord.ButtonStyle.Link).setLabel('¡Invítame!').setURL(bot.application.url).setEmoji('❤️'))] });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
