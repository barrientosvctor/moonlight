import { EmbedBuilder, Guild } from "discord.js";
import { EventBuilder } from "../../structures/EventBuilder.js";

export default new EventBuilder({
  name: "guildCreate",
  async run(bot, guild: Guild) {
    try {
      let botName = "";
      if (!bot.user)
        botName = "Moonlight";
      else
        botName = bot.user.username;

      const embed = new EmbedBuilder()
        .setThumbnail(guild.iconURL({ extension: "png", size: 2048 }))
        .setTitle(`${botName} ha sido añadido a un nuevo servidor!`)
        .addFields({
          name: "• Información del servidor",
          value: `\`\`\`diff\n+ Nombre: ${guild.name}\n+ Propietario: ${bot.users.cache.get(guild.ownerId)?.username}#${bot.users.cache.get(guild.ownerId)?.discriminator}\n+ Server ID: ${guild.id}\n+ Miembros: ${guild.memberCount} (Humanos: ${guild.members.cache.filter((m) => !m.user.bot).size})\n\`\`\``
        }, {
          name: `• Estadísticas de ${bot.user?.tag}`, value: `\`\`\`diff\n- Servidores: ${bot.guilds.cache.size.toLocaleString()}\n- Usuarios: ${bot.users.cache.size.toLocaleString()}\n- Canales: ${bot.channels.cache.size.toLocaleString()}\n- Emotes: ${bot.emojis.cache.size.toLocaleString()}\n\`\`\``
        })
        .setColor("Green")
        .setTimestamp();
      bot.hook.send({ embeds: [embed] });
    } catch (err) {
      if (err instanceof Error)
        bot.logger.writeError(err);
    }
  }
});
