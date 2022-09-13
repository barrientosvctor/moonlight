let Command = require('../../base/models/Command'),
discord = require('discord.js');
//Docs = require('discord.js-docs');
module.exports = new Command({
    name: 'djs',
    description: 'Obtén información de la documentación de discord.js y de la API de discord.js.',
    cooldown: 3,
    aliases: ['docs', 'discordjs'],
    category: 'Desarrollador',
    usage: '<busqueda>',
    example: 'BaseClient',
    ownerOnly: true,
    enabled: false,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            /** @param {string} str */
            const replaceDisco = (str) => str.replace(/docs\/docs\/disco/g, `docs/discord.js/stable`).replace(/ \(disco\)/g, '');
            let doc = await Docs.fetch('stable'),
            results = await doc.resolveEmbed(args);

            if(!results) return 'No se encontró ningún resultado.';
            let string = replaceDisco(JSON.stringify(results)),
            embed = JSON.parse(string);
            embed.author.url = 'https://discord.js.org/';
            let extra =
  '\n\nView more here: ' +
  /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    .exec(embed.description)[0]
    .split(')')[0]

    for(let field of embed.fields || []) {
        if(field.value.length >= 1024) {
            field.value = field.value.slice(0, 1024);
            let split = field.value.split(' '),
            joined = split.join(' ');

            while(joined.length >= 1024 - extra.length) {
                split.pop();
                joined = split.join(' ');
            }
            field.value = joined + extra;
        }
    }

    if(embed.fields && embed.fields[embed.fields.length-1].value.startsWith('[View source')){
        embed.fields.pop();
    }
    return embed;

        } catch (err) {
            bot.err('Hubo un error al intentar obtener la documentación de discordjs.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
