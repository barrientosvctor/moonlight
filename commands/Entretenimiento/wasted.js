let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'wasted',
    description: 'Wasted moment',
    cooldown: 3,
    category: 'Entretenimiento',
    usage: '<@usuario | ID>',
    example: '@NeonDark#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o escribe la ID de un usuario de Discord.`);
            let user = await getUser(args[1]),
            embed = new discord.MessageEmbed();
            if(!user) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, ese usuario no existe.`);

            embed.setColor('RANDOM')
            embed.setImage(`https://some-random-api.ml/canvas/wasted?avatar=${user.displayAvatarURL({ size: 2048, format: 'png' })}`);

            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});