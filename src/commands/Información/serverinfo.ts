import { ChannelType, GuildPremiumTier } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "serverinfo",
    description: "Muestra información del servidor.",
    cooldown: 3,
    aliases: ["svinfo", "serverinf", "svinf"],
    enabled: true,
    async run(bot, msg) {
        try {
            const data = await fetch(`https://discord.com/api/v10/guilds/${msg.guildId}`, {
                method: "get",
                headers: {
                    Authorization: `Bot ${process.env.BOT_TOKEN}`
                }
            }).then(res => res.json());

            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
            .setThumbnail(msg.guild?.iconURL({ size: 2048, extension: "png" }) || null)
            .setTitle(`Información de ${msg.guild?.name}`)
            .setDescription(`
            **Nombre:** ${msg.guild?.name}
            **Descripción:** ${msg.guild?.description || "Ninguno"}
            **ID:** ${msg.guildId}
            **Dueño:** ${msg.guild?.members.cache.get(msg.guild.ownerId)?.user.tag}
            **Boost:** ${msg.guild?.premiumTier !== GuildPremiumTier.None ? `${msg.guild?.premiumSubscriptionCount} (${bot.utils.guild.premiumTier[msg.guild?.premiumTier]})` : `*Ninguno*`}
            **Icono:** [Icono de ${msg.guild?.name}](${msg.guild?.iconURL({ size: 2048, extension: "png" })})
            **Banner:** ${data.banner ? `[Banner de ${msg.guild?.name}](https://cdn.discordapp.com/banners/${msg.guildId}/${data.banner}.${data.banner.startsWith('a_') ? "gif" : "png"}?size=2048)` : "*Ninguno*"}
            **Fecha de creación:** <t:${Math.ceil(msg.guild?.createdTimestamp! / 1000)}>

            **Características:** ${msg.guild?.features.map(feature => `${bot.utils.guild.features[feature]}`).join(', ') || '*Ninguno*'}
            **Nivel de verificación:** ${bot.utils.guild.verificationLevel[msg.guild?.verificationLevel]}
            **Filtro de contenido explícito:** ${bot.utils.guild.explicitContentFilter[msg.guild?.explicitContentFilter]}
            **Nivel de MFA**: ${bot.utils.guild.mfaLevel[msg.guild?.mfaLevel]}

            **Usuarios:** ${msg.guild?.members.cache.filter(m => !m.user.bot).size}
            **Bots:** ${msg.guild?.members.cache.filter(m => m.user.bot).size}
            **Total:** ${msg.guild?.memberCount}
            **Canales:** ${msg.guild?.channels.cache.size} (Texto: ${msg.guild?.channels.cache.filter(c => c.type === ChannelType.GuildText).size} | Voz: ${msg.guild?.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size} | Categorías: ${msg.guild?.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size})
            **Emojis:** ${msg.guild?.emojis.cache.size}
            **Stickers:** ${msg.guild?.stickers.cache.size}
            **Roles:** ${msg.guild?.roles.cache.filter(r => r !== msg.guild?.roles.everyone).size}`)

            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar obtener información del servidor.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
