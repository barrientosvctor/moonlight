let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default,
http_validation = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig;
module.exports = new Command({
    name: 'screenshot',
    description: 'Sácale una captura de pantalla a cualquier sitio web.',
    cooldown: 3,
    aliases: ['screen', 'shot'],
    category: 'Utilidades',
    usage: '<url>',
    example: 'google.com',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una URL para mostrar.`);
            if(!http_validation.test(args[1])) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, escribe una URL válida.`);
            else {
                if(bot.nsfw_url.some(url => args[1].toLowerCase().includes(url)) && !msg.channel.nsfw) return msg.channel.send(`${bot.getEmoji('warning')} Esta URL contiene contenido adulto, para ver la URL ejecute el comando en un canal de texto catalogado cómo NSFW.`);
                if(bot.bl_url.some(url => args[1].toLowerCase().includes(url))) return msg.channel.send(`${bot.getEmoji('error')} Esta URL está en la lista negra, prueba a poner otra URL.`);

                let embed = new discord.MessageEmbed();
                embed.setDescription(`${bot.getEmoji('waiting')} **Sacando captura, por favor espere...**`)
                embed.setColor('RANDOM');
                let waitMsg = await msg.reply({ embeds: [embed], files: [] });

                let data = await fetch(`https://shot.screenshotapi.net/screenshot?token=${process.env.screenshot_token}&url=${encodeURIComponent(args[1])}&width=1920&height=1080&output=json&file_type=png&destroy_screenshot=true&block_tracking=true&wait_for_event=load`).then(res => res.json()),
                attachment = new discord.MessageAttachment(data.screenshot, 'screenshot.png');

                embed.setDescription(`URL: ${data.url}`)
                embed.setImage('attachment://screenshot.png')
                embed.setColor('RANDOM');
                return waitMsg.edit({ embeds: [embed], files: [attachment] });
            }
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
