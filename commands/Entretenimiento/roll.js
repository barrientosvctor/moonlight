let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'roll',
    description: 'Lanza un dado de 6 caras.',
    cooldown: 3,
    aliases: ['dado'],
    category: 'Entretenimiento',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            let intento = Math.floor(Math.random() * 7),
            embed = new discord.MessageEmbed();
            embed.setColor('RANDOM')
            if(intento === 1) {
                embed.setDescription(`${msg.author.username}, tiraste el dado, y cayó: **1**`)
                embed.setImage('https://i.imgur.com/SVNKSUH.png');
            } else if (intento === 2) {
                embed.setDescription(`${msg.author.username}, tiraste el dado, y cayó: **2**`)
                embed.setImage('https://i.imgur.com/WYDDVyi.png');
            } else if (intento === 3) {
                embed.setDescription(`${msg.author.username}, tiraste el dado, y cayó: **3**`)
                embed.setImage('https://i.imgur.com/qXzKGhY.png');
            } else if (intento === 4) {
                embed.setDescription(`${msg.author.username}, tiraste el dado, y cayó: **4**`)
                embed.setImage('https://i.imgur.com/YEM9Ti2.png');
            } else if (intento === 5) {
                embed.setDescription(`${msg.author.username}, tiraste el dado, y cayó: **5**`)
                embed.setImage('https://i.imgur.com/bHHdyql.png');
            } else if (intento === 6) {
                embed.setDescription(`${msg.author.username}, tiraste el dado, y cayó: **6**`)
                embed.setImage('https://i.imgur.com/YbpnXnm.png');
            } else {
                embed.setDescription(`${msg.author.username}, tiraste el dado, y cayó: **9**... ¡Rompiste el juego!`)
                embed.setImage('https://i.imgur.com/to3YV2i.png');
            }
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});