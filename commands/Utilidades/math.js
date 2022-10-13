let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'math',
    description: 'Una calculadora que resuelve problemas matemáticos.',
    aliases: ['calculadora', 'calc'],
    cooldown: 3,
    usage: '<expresión>',
    example: '2+2',
    enabled: true,
    filename: __filename,
    dirname: __dirname,
    async run(bot, msg, args) {
        if(!args[1]) return msg.channel.send(`**${msg.author.username}**, escribe una expresión matemática.`);

        const data = await fetch(`https://api.mathjs.org/v4/?expr=${args.slice(1).join(' ').replace(`+`, `%2B`).replace(`^`, `%5E`).replace(`/`, `%2F`)}`, { method: 'GET' }).then(res => res.text());
        if(data.includes('Error')) return msg.channel.send(`${bot.getEmoji('error')} **${msg.author.username}**, por favor escribe una expresión válida.`);

        return msg.reply({ embeds: [new discord.EmbedBuilder().setColor('Green').setTitle(':1234: Calculadora').addFields({ name: 'Expresión', value: `\`\`\`\n${args.slice(1).join(' ')}\n\`\`\`` }, { name: 'Resultado', value: `\`\`\`\n${data}\n\`\`\`` })] });
    }
});
