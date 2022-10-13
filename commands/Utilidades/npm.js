let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'npm',
    description: 'Obtiene resultados de paquetes en la página de npmjs.org.',
    cooldown: 3,
    aliases: ['package'],
    category: 'Utilidades',
    usage: '<nombre>',
    example: 'axios',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe el nombre de algún paquete que esté en la página de npmjs.org.`);

            const data = await fetch(`https://registry.npmjs.org/${args[1]}`, { method: 'GET' }).then(res => res.json());
            let embed = new discord.EmbedBuilder();

            if(data.error) return msg.channel.send(`${bot.getEmoji('error')} El paquete **${args[1]}** no existe.`);

	    /** @type {string} */

            embed.setColor('Random')
            embed.setAuthor({ name: 'npmjs.com', iconURL: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/2560px-Npm-logo.svg.png' })
            embed.setDescription(`> __Información general__\n**Nombre del paquete:** ${data.name}\n**Descripción:** ${data.description}\n**Autor:** ${data.author ? data.author.name : 'Desconocido'}\n**Colaboradores:** ${data.maintainers.map(m => m.name).join(', ')}\n**Licencia** ${data.license}\n**Palabras claves:** ${data.keywords.map(k => k).join(', ')}\n**Instalación:** \`npm i ${data.name}\`\n**Última versión:** ${data['dist-tags'].latest}\n\n> __Links__\n${data.homepage ? `[Homepage](${data.homepage})` : 'Homepage: Ninguno'}\n${data.bugs ? `[Bugs](${data.bugs.url})` : 'Bugs: Ninguno'}`);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
