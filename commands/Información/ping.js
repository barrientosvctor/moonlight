let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'ping',
    description: 'Recibe la latencia actual del bot.',
    cooldown: 3,
    category: 'Información',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            msg.reply(`*Pong* :ping_pong: --- Latencia actual: **${Date.now() - msg.createdTimestamp}ms** (WebSocket: **${bot.ws.ping}ms**)`);
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar ejecutar el comando.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
