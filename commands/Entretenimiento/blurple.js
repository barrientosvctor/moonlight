let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'blurple',
    description: 'Blurplifica la foto de perfil de un usuario de Discord.',
    cooldown: 3,
    category: 'Entretenimiento',
    usage: '<@usuario | ID>',
    example: '@Kevin#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o pon la ID del usuario.`);
            let user = await getUser(args[1]),
            embed = new discord.MessageEmbed();
            if(!user) return msg.channel.send(`**${msg.author.username}**, el usuario no existe.`);
            embed.setDescription('**¡Bloop!**')
            embed.setColor('#7389DB')
            embed.setImage(`https://some-random-api.ml/canvas/blurple?avatar=${user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true })}`);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});