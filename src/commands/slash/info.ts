import { APIGuild, APIUser, ChannelType, EmbedBuilder, GuildMember, GuildPremiumTier, Role, Routes, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("info")
  .setDescription("Comandos para obtener información.")
  .addSubcommand(cmd =>
    cmd
    .setName("channel")
    .setDescription("Obtén información sobre algún canal del servidor.")
    .addChannelOption(ch =>
      ch
      .setName("name")
      .setDescription("Elige un canal para obtener información.")
      .setRequired(true)
      .addChannelTypes(ChannelType.GuildText)))
  .addSubcommand(cmd =>
    cmd
    .setName("role")
    .setDescription("Obtén información sobre un rol del servidor.")
    .addRoleOption(role =>
      role
      .setName("role")
      .setDescription("Elige un rol para obtener información.")
      .setRequired(true)))
  .addSubcommand(cmd =>
    cmd
    .setName("server")
    .setDescription("Obtén información sobre el servidor."))
  .addSubcommand(cmd =>
    cmd
    .setName("user")
    .setDescription("Obtén información sobre un usuario de Discord.")
    .addUserOption(user =>
      user
      .setName("user")
      .setDescription("Elige un usuario para obtener información.")
      .setRequired(true))),
  testGuildOnly: true,
  async run(interaction, client) {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === "channel") {
      const channel = interaction.options.getChannel("name", true) as TextChannel;

      if (!channel) return interaction.reply("No se pudo encontrar ese canal.");

      const embed = new EmbedBuilder()
      .setTitle(`Información del canal #${channel.name}`)
      .setColor("Random");
      let info = `**Posición en lista:** ${channel.position + 1}\n**Descripción:** ${channel.topic || "Ninguno"}\n**NSFW:** ${channel.nsfw ? "Sí" : "No"}\n**Modo lento:** ${channel.rateLimitPerUser > 0 ? "Activado" : "Desactivado"}`;

      embed.setDescription(`**ID:** ${channel.id}\n${info}`);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "role") {
      const role = interaction.options.getRole("role", true) as Role;

      if (!role) return interaction.reply("No se pudo encontrar ese rol.");

      const embed = new EmbedBuilder()
      .setColor(role.hexColor || "Random")
      .setTitle(`Información del rol @${role.name}`)
      .setDescription(
        `
**Nombre:** ${role.name}
**ID:** ${role.id}
**Color:** ${role.hexColor}
**Miembros con este rol:** ${role.members.size}
**¿Separado?** ${role.hoist ? "Sí" : "No"}
**¿Administrado?** ${role.managed ? "Sí" : "No"}
**¿Mencionable?** ${role.mentionable ? "Sí" : "No"}
**¿Editable?** ${role.editable ? "Sí" : "No"}
**Fecha de creación:** <t:${Math.ceil(role.createdTimestamp / 1000)}>
`)
      .addFields({
        name: "Permisos",
        value: role.permissions.toArray().map(permission => client.wrapper.get("guild.roles.permissions", permission)).join(", ")
      });

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "server") {
      if (!interaction.inGuild() || !interaction.guild) return interaction.reply("Para usar éste subcomando debes de hacer uso de él en un servidor.");

      const data = (await client.rest.get(Routes.guild(interaction.guild.id))) as APIGuild;

      const embed = new EmbedBuilder()
      .setThumbnail(interaction.guild.iconURL({ size: 2048, extension: "png" }))
      .setColor("Random")
      .setTitle(`Información de ${interaction.guild.name}`).setDescription(`
**Nombre:** ${interaction.guild.name}
**Descripción:** ${interaction.guild.description || "Ninguno"}
**ID:** ${interaction.guildId}
**Dueño:** ${interaction.guild.members.cache.get(interaction.guild.ownerId)?.user.tag || "*Desconocido*"}
**Boost:** ${interaction.guild.premiumTier !== GuildPremiumTier.None ? `${interaction.guild.premiumSubscriptionCount} (${client.wrapper.get("guild.premiumTier", interaction.guild.premiumTier.toString())})` : `*Ninguno*`}
**Icono:** ${interaction.guild.icon ? `[Icono de ${interaction.guild.name}](${interaction.guild.iconURL({ size: 2048, extension: "png" })})` : "No establecido."}
**Banner:** ${data.banner ? `[Banner de ${interaction.guild.name}](https://cdn.discordapp.com/banners/${interaction.guildId}/${data.banner}.${data.banner.startsWith("a_") ? "gif" : "png"}?size=2048)` : "*Ninguno*"}
**Fecha de creación:** <t:${Math.ceil(interaction.guild.createdTimestamp! / 1000)}>

**Características:** ${interaction.guild.features.map(feature => `${client.wrapper.get("guild.features", feature)}`).join(", ") || "*Ninguno*"}
**Nivel de verificación:** ${client.wrapper.get("guild.verificationLevel", interaction.guild.verificationLevel.toString())}
**Filtro de contenido explícito:** ${client.wrapper.get("guild.explicitContentFilter", interaction.guild.explicitContentFilter.toString())}
**Nivel de MFA**: ${client.wrapper.get("guild.mfaLevel", interaction.guild.mfaLevel.toString())}

**Total de usuarios:** ${interaction.guild.memberCount}
**Canales:** ${interaction.guild.channels.cache.size} (Texto: ${interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size} | Voz: ${interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size} | Categorías: ${interaction.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size})
**Emojis:** ${interaction.guild.emojis.cache.size}
**Stickers:** ${interaction.guild.stickers.cache.size}
**Roles:** ${interaction.guild.roles.cache.filter(r => r !== interaction.guild?.roles.everyone).size}`);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "user") {
      if (!interaction.inGuild() || !interaction.guild) return;

      const user = interaction.options.getUser("user", true);
      const userApiData = (await client.rest.get(Routes.user(user.id))) as APIUser;
      const embed = new EmbedBuilder().setColor(userApiData.accent_color || "Random");

      if (!user) return interaction.reply("El usuario no fue encontrado.");

      if (!interaction.guild.members.cache.get(user.id)) {
        embed
          .setThumbnail(user.displayAvatarURL({ size: 2048, extension: "png" }))
          .setTitle(`Información del ${user.bot ? "bot" : "usuario"} ${user.tag}`)
          .setDescription(`
**ID:** \`${user.id}\`
**Avatar:** [Avatar de ${user.username}](${userApiData.avatar ? `https://cdn.discordapp.com/avatars/${user.id}/${userApiData.avatar}.${userApiData.avatar.startsWith("a_") ? "gif" : "png"}?size=2048` : user.displayAvatarURL({ size: 2048, extension: "png" })})
**Banner:** ${userApiData.banner ? `[Banner de ${user.username}](https://cdn.discordapp.com/banners/${user.id}/${userApiData.banner}.${userApiData.banner.startsWith("a_") ? "gif" : "png"}?size=2048)` : userApiData.accent_color ? `\`${userApiData.accent_color.toString(16)}\`` : "No tiene banner"}
**Fecha de creación:** <t:${Math.ceil(user.createdTimestamp / 1000)}>
**Insignias:** ${user.flags?.toArray().map(flag => `${client.wrapper.get("flags", flag)}`).join(", ") || "No tiene insignias"}
`);
      } else {
        const member = interaction.options.getMember("user") as GuildMember;
        if (!member) return interaction.reply("No se pudo encontrar a éste usuario.");

        embed
          .setThumbnail(member.user.displayAvatarURL({ size: 2048, extension: "png" }) || null)
          .setTitle(`Información del ${member.user.bot ? "bot" : "miembro"} ${member.user.tag}`)
          .setDescription(
            `
**ID:** ${member.user.id}
**Avatar:** [Avatar de ${member.user.username}](${member.displayAvatarURL({ size: 2048, extension: "png" })})
**Banner:** ${userApiData.banner ? `[Banner de ${member.user.username}](https://cdn.discordapp.com/banners/${member.user.id}/${userApiData.banner}.${userApiData.banner.startsWith("a_") ? "gif" : "png"}?size=2048)` : userApiData.accent_color ? `\`${userApiData.accent_color.toString(16)}\`` : "No tiene banner"}
**Fecha de creación:** <t:${Math.ceil(member.user.createdTimestamp / 1000)}>
**Insignias:** ${member.user.flags?.toArray().map(flag => `${client.wrapper.get("flags", flag)}`).join(", ") || "No tiene insignias"}
**Apodo:** ${member.nickname || "No tiene apodo"}
**Fecha de ingreso:** <t:${Math.ceil(member.joinedTimestamp! / 1000)}>`)
          .addFields({
            name: `Roles (${member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== interaction.guild?.roles.everyone).map(role => role).length})`,
            value: member.roles.cache.sort((a, b) => b.position - a.position).filter(role => role !== interaction.guild?.roles.everyone).map(role => role).join(", ") || "No tiene roles."
          });
      }

      return interaction.reply({ embeds: [embed] });
    }

    return interaction.reply("Haz uso de los diferentes subcomandos que ofrece éste comando.");
  },
});
