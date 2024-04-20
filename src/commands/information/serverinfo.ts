import { ChannelType, EmbedBuilder, GuildPremiumTier, Routes } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "serverinfo",
  cooldown: 5,
  category: "Información",
  description: "Te da información sobre el servidor.",
  aliases: ["svinfo"],
  async run(client, message) {
    if (!message.inGuild()) return;

    const data: any = await client.rest.get(Routes.guild(message.guildId));

    const embed = new EmbedBuilder()
      .setThumbnail(message.guild.iconURL({ size: 2048, extension: "png" }))
      .setColor("Random")
      .setTitle(`Información de ${message.guild.name}`)
      .setDescription(`
**Nombre:** ${message.guild.name}
**Descripción:** ${message.guild.description || "Ninguno"}
**ID:** ${message.guildId}
**Dueño:** ${message.guild.members.cache.get(message.guild.ownerId)?.user.tag || "*Desconocido*"}
**Boost:** ${message.guild.premiumTier !== GuildPremiumTier.None ? `${message.guild.premiumSubscriptionCount} (${client.wrapper.get("guild.premiumTier", message.guild.premiumTier.toString())})` : `*Ninguno*`}
**Icono:** [Icono de ${message.guild.name}](${message.guild.iconURL({ size: 2048, extension: "png" })})
**Banner:** ${data.banner ? `[Banner de ${message.guild.name}](https://cdn.discordapp.com/banners/${message.guildId}/${data.banner}.${data.banner.startsWith('a_') ? "gif" : "png"}?size=2048)` : "*Ninguno*"}
**Fecha de creación:** <t:${Math.ceil(message.guild.createdTimestamp! / 1000)}>

**Características:** ${message.guild.features.map(feature => `${client.wrapper.get("guild.features", feature)}`).join(', ') || '*Ninguno*'}
**Nivel de verificación:** ${client.wrapper.get("guild.verificationLevel", message.guild.verificationLevel.toString())}
**Filtro de contenido explícito:** ${client.wrapper.get("guild.explicitContentFilter", message.guild.explicitContentFilter.toString())}
**Nivel de MFA**: ${client.wrapper.get("guild.mfaLevel", message.guild.mfaLevel.toString())}

**Total de usuarios:** ${message.guild.memberCount}
**Canales:** ${message.guild.channels.cache.size} (Texto: ${message.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size} | Voz: ${message.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size} | Categorías: ${message.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size})
**Emojis:** ${message.guild.emojis.cache.size}
**Stickers:** ${message.guild.stickers.cache.size}
**Roles:** ${message.guild.roles.cache.filter(r => r !== message.guild.roles.everyone).size}
`)

    return message.reply({ embeds: [embed] });
  }
});
