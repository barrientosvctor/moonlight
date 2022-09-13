let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'clyde',
    description: 'Clyde es una persona muy linda que escribe lo que tu quieres que escriba.',
    cooldown: 3,
    category: 'Entretenimiento',
    usage: '<texto>',
    example: 'Hey, cómo estás?',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe algo.`);
            if(args.slice(1).join(' ').length > 72) return msg.channel.send(`**${msg.author.username}**, el texto es demasiado largo! Escribe algo menor a 73 carácteres.`);
            let data = await fetch(`https://nekobot.xyz/api/imagegen?type=clyde&text=${args.slice(1).join(' ').replace(' ', '%20')}`).then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setColor('RANDOM')
            embed.setImage(data.message);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
