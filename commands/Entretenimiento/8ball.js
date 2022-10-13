let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: '8ball',
    description: 'Preguntale cualquier cosa a la bola mágica.',
    cooldown: 3,
    aliases: ['8', 'ocho'],
    category: 'Entretenimiento',
    usage: '<pregunta>',
    example: 'Inserté una pregunta acá?',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribele una pregunta a la bola mágica.`);
            const resp = ['Sí.', 'No.', 'Lo dudo.', 'Lo dudo mucho.', 'Estoy indeciso.', 'No puedo responder esa pregunta en este momento.', 'Como yo lo veo, sí.', 'Me parece que sí.', 'No lo creo.', 'Sin duda', 'Tal vez no', '¿Y si no?', '¿Qué clase de pregunta es esa ${message.author.username}?', 'Tal vez sí.', 'Puede ser.', 'Tu pregunta me hizo dudar.', 'Sin lugar a dudas.', 'Sí, definitivamente.', 'Muy dudoso.', 'Respuesta confusa, vuelve a intentarlo.', 'Mis fuentes dicen que no.', 'No cuentes con ello.', 'No te puedo responder esa pregunta ahora.', 'Vuelve a preguntar más tarde.', 'Tal vez.'];
            return msg.reply(`:8ball: **${resp[Math.floor(Math.random() * resp.length)]}**`);
        } catch (err) {
            bot.err('Hubo un error al intentar obtener una respuesta de la bola mágica.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
