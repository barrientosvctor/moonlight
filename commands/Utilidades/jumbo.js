let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'jumbo',
    description: 'Obtiene información acerca de un emoji del servidor.',
    cooldown: 3,
    category: 'Utilidades',
    usage: '<:emoji:>',
    example: ':RappiHappu:',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, debes de poner un emoji.`);
            let emoji = msg.guild.emojis.cache.find(e => e.name === args[1].split(':')[1]);
            if(!emoji) return msg.channel.send(`**${msg.author.username}**, ese emoji no se encontró en este servidor.`);
            return msg.reply(`> Nombre: \`${emoji.name}\`\n> Emoji: ${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`}\n> ID: \`${emoji.id}\`\n> Identificador: \`${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`}\`\n> Fecha de creación: <t:${Math.ceil(emoji.createdTimestamp / 1000)}>\n> URL: ${emoji.url}`);
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});