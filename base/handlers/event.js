let fs = require('fs'),
count = 0;
module.exports = (bot) => {
    fs.readdirSync('./events/').forEach(sc => {
        fs.readdirSync(`./events/${sc}`).filter(f => f.endsWith('.js')).forEach(file => {
            ++count;
            let event = require(`../../events/${sc}/${file}`);
            if(event.once) bot.once(event.name, (...args) => event.run(bot, ...args));
            else bot.on(event.name, (...args) => event.run(bot, ...args));
        });
    });
    //console.log(`[Eventos] ${fs.readdirSync('./events/').filter(e => e.endsWith('.js')).length} eventos cargados con éxito.`);
    console.log(`[Eventos] ${count} eventos cargados con éxito.`);
};
