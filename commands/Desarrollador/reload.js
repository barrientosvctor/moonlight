let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'reload',
    description: 'Reinicia cualquier comando del bot.',
    cooldown: 3,
    aliases: ['refresh'],
    category: 'Desarrollador',
    usage: '<cmd name>',
    example: 'help',
    ownerOnly: true,
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            if(!args[1]) return msg.channel.send('Debes especificar el comando que deseas reiniciar');
            let cmd = bot.cmds.find(cmd => cmd.name === args[1].toLowerCase() || cmd.aliases && cmd.aliases.includes(args[1].toLowerCase()));
            if(args[1] === '--all') {
                bot.reloadAllCommands();
                return msg.channel.send('Todos los comandos fueron reiniciados');
            } else if(cmd) {
                bot.reloadCommand(args[1]);
                return msg.channel.send(`El comando \`${cmd.name}\` fue reiniciado`);
            } else {
                return msg.channel.send('El comando no existe');
            }
        } catch (err) {
            bot.err('Hubo un error al intentar reiniciar el(los) comando(s)', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
