let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'colorfilter',
    description: 'Filtra de color la foto de perfil de un usuario de Discord.',
    cooldown: 3,
    aliases: ['filtrar'],
    category: 'Entretenimiento',
    usage: '<@usuario | ID> <hex color>',
    example: '@AElfy#0001',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, menciona o pon el ID de un usuario de Discord.`);
	    /** @type {discord.User} */
            const user = await getUser(args[1]);
            let embed = new discord.EmbedBuilder();
            if(!user) return msg.channel.send(`**${msg.author.username}**, el usuario no existe.`);
            if(!args[2]) return msg.channel.send(`**${msg.author.username}**, escribe el código hexadecimal del color que quieres filtrar.`);
            if(!args[2].startsWith('#')) return msg.channel.send(`**${msg.author.username}**, el código hexadecimal debe empezar con **#**.`);
            if(args[2].slice(1).length !== 6) return msg.channel.send(`**${msg.author.username}**, el código hexadecimal debe tener 6 caracteres.`);
            embed.setColor('Random')
            embed.setImage(`https://some-random-api.ml/canvas/color?avatar=${user.displayAvatarURL({ size: 2048, extension: 'png' })}&color=${args[2].slice(1)}`);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
