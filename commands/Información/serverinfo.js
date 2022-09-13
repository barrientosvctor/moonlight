let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'serverinfo',
    description: 'Muestra información acerca del servidor.',
    cooldown: 3,
    aliases: ['server', 'sv'],
    category: 'Información',
    enabled: true,
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg) {
        try {
            let data = await fetch(`https://discord.com/api/guilds/${msg.guildId}`, { method: 'GET', headers: { Authorization: `Bot ${process.env.login}` }}).then(res => res.json()),
            embed = new discord.MessageEmbed();
            embed.setTitle(`Información del servidor ${msg.guild.name}`)
            .setColor('RANDOM')
            .setThumbnail(msg.guild.iconURL({ size: 2048, format: 'png', dynamic: true }))
            .setDescription(`
            **Nombre:** ${msg.guild.name}
            **Descripción:** ${msg.guild.description || '*Ninguno*'}
            **ID:** ${msg.guildId}
            **Dueño:** ${msg.guild.members.cache.get(msg.guild.ownerId).user.tag}
            **Boost:** ${msg.guild.premiumTier !== 'NONE' ? `${msg.guild.premiumSubscriptionCount} (${bot.utils.guild.premiumTier[msg.guild.premiumTier]})` : `*Ninguno*`}
            **Icono:** [Icono de ${msg.guild.name}](${msg.guild.iconURL({ size: 2048, format: 'png', dynamic: true })})
            **Banner:** ${data.banner ? `[Banner de ${msg.guild.name}](https://cdn.discordapp.com/banners/${msg.guildId}/${data.banner}.${data.banner.startsWith('a_') ? 'gif' : 'png'}?size=2048)` : '*Ninguno*'}
            **Fecha de creación:** <t:${Math.ceil(msg.guild.createdTimestamp / 1000)}>
            **Características:** ${msg.guild.features.map(ft => `${bot.utils.guild.features[ft]}`).join(', ') || '*Ninguno*'}

            **Nivel de verificación:** ${bot.utils.guild.verificationLevel[msg.guild.verificationLevel]}
            **Filtro de contenido explícito:** ${bot.utils.guild.explicitContentFilter[msg.guild.explicitContentFilter]}
            **Nivel de MFA**: ${bot.utils.guild.mfaLevel[msg.guild.mfaLevel]}

            **Usuarios:** ${msg.guild.members.cache.filter(m => !m.user.bot).size}
            **Bots:** ${msg.guild.members.cache.filter(m => m.user.bot).size}
            **Total:** ${msg.guild.memberCount}
            **Canales:** ${msg.guild.channels.cache.size} (Texto: ${msg.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').size} | Voz: ${msg.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE').size} | Categorías: ${msg.guild.channels.cache.filter(c => c.type === 'GUILD_CATEGORY').size})
            **Emojis:** ${msg.guild.emojis.cache.size}
            **Stickers:** ${msg.guild.stickers.cache.size}
            **Roles:** ${msg.guild.roles.cache.filter(r => r !== msg.guild.roles.everyone).size}`)
            .setFooter({ text: `Pedido por: ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL({ dynamic: true }) });
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.err(`Hubo un error desconocido al intentar obtener los datos del servidor.`, { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
