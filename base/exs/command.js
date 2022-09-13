let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: '',
    description: '',
    cooldown: 3,
    aliases: [],
    category: '',
    usage: '',
    example: '',
    ownerOnly: false,
    nsfwOnly: false,
    enabled: true,
    botPerms: [],
    memberPerms: [],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {
        try {
            // Código del comando acá
        } catch (err) {
            bot.err('Hubo un error al intentar ejecutar el comando.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});