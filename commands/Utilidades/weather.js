let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'weather',
    description: 'Consulta el pronóstico aproximado del clima con este comando.',
    cooldown: 3,
    aliases: ['clima'],
    category: 'Utilidades',
    usage: '<pais / ciudad>',
    example: 'Madrid',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el nombre de un país o ciudad para obtener el pronóstico del clima`);
            const data = await fetch(`https://api.popcat.xyz/weather?q=${args.slice(1).join(' ').replace(' ', '%20')}`, { method: 'GET' }).then(res => res.json());
            const embed = new discord.EmbedBuilder()
            .setTitle(`Ubicación: ${data[0].location.name}`)
            .setDescription(`
      > __Pronóstico del clima__
      **Ubicación:** ${data[0].location.name}
      **Cielo:** ${data[0].current.skytext}
      **Temperatura:** ${data[0].current.temperature}°${data[0].location.degreetype}
      **Sensación térmica:** ${data[0].current.feelslike}°${data[0].location.degreetype}
      **Humedad:** ${data[0].current.humidity}%
      **Velocidad del viento:** ${data[0].current.winddisplay}
      
      > __Otra información__
      **Día:** ${data[0].current.day} (${data[0].current.shortday})
      **Fecha y hora:** ${data[0].current.date} - ${data[0].current.observationtime}
      **Zona horaria:** GMT${data[0].location.timezone}`)
            .setThumbnail(data[0].current.imageUrl)
            .setColor('Random');
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err(`**${msg.author.username}**, la ciudad o país **${args.slice(1).join(' ')}** no fue encontrado, sé más específico.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
