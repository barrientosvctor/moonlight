let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'rps',
    description: 'Juega al mítico juego de piedra, papel o tijera contra el bot.',
    cooldown: 3,
    category: 'Entretenimiento',
    usage: '<piedra / papel / tijera>',
    example: 'papel',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send('Debes especificar una opción. (piedra / papel / tijera)');
            if(!['piedra', 'papel', 'tijera'].includes(args[1].toLowerCase())) return msg.channel.send('Debes especificar una opción válida. (piedra / papel / tijera)');
            const botChoice = ['piedra', 'papel', 'tijera'][Math.floor(Math.random() * 3)];
            return msg.reply(bot.rps(args[1], botChoice));
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
