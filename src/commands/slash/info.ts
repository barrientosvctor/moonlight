import { ChannelType, EmbedBuilder, Role, SlashCommandBuilder, TextChannel } from "discord.js";
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
      .setDescription("Elige un usuario para obtener información")
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
    }

    return interaction.reply("Haz uso de los diferentes subcomandos que ofrece éste comando.");
  },
});
