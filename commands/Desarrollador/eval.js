let Command = require('../../base/models/Command'),
discord = require('discord.js'),
{ inspect } = require('util');
module.exports = new Command({
    name: 'eval',
    description: 'Evalúa código JavaScript.',
    cooldown: 3,
    aliases: ['ev'],
    category: 'Desarrollador',
    usage: '<código>',
    example: 'console.log("Hola mundo!")',
    ownerOnly: true,
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        let embed = new discord.EmbedBuilder()
        try {
            if(!args[1]) return msg.channel.send(`**${msg.author.username}**, debes escribir algo para evaluar.`);
            embed.setColor('Green')
            embed.setTitle('¡Código evaluado correctamente!')
            embed.setDescription(`**Tipo:** \`\`\`prolog\n${typeof(eval(args.slice(1).join(' ')))}\`\`\`\n**Evaluado en:** \`\`\`yaml\n${Date.now() - msg.createdTimestamp}ms\`\`\`\n**Entrada:** \`\`\`js\n${args.slice(1).join(' ')}\`\`\`\n**Salida:** \`\`\`js\n${inspect(eval(args.slice(1).join(' ')), { depth: 0 })}\`\`\``);
            return msg.channel.send({ embeds: [embed] });
        } catch (err) {
            embed.setTitle('Hubo un error al evaluar el código.')
	    embed.addFields({ name: 'Entrada', value: `\`\`\`js\n${args.slice(1).join(' ')}\`\`\`` }, { name: 'Error', value: `\`\`\`js\n${err}\`\`\`` });
            return msg.channel.send({ embeds: [embed] });
        }
    }
});
