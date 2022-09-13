let fs = require('fs'),
Command = require('../models/Command'),
c = 0;
module.exports = (bot) => {
    fs.readdirSync('./commands/').forEach(sc => {
        fs.readdirSync(`./commands/${sc}/`).filter(f => f.endsWith('.js')).forEach(file => {
            /**
             * @type {Command}
             */
            let cmd = require(`../../commands/${sc}/${file}`);
            if(cmd.name) {
                ++c
                bot.cmds.set(cmd.name, cmd);
                if(cmd.aliases && Array.isArray(cmd.aliases)) cmd.aliases.forEach(alias => bot.aliases.set(alias, cmd.name));
            } else throw new Error(`${cmd.filename} - Hay un comando que no tiene un nombre.`);
        });
    });
    console.log(`[Comandos] ${c} comandos cargados con éxito.`);
};