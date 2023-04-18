import { EmbedBuilder, Guild } from "discord.js";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
  name: "guildDelete",
  async run(bot, guild: Guild) {
    try {
      const embed = new EmbedBuilder()
      .setThumbnail(guild.iconURL({ extension: "png", size: 2048 }))
      .setTitle(`${bot.user?.username} fue sacado de un servidor!`)
      .setColor("Red")
      .addFields({
        name: `• Información del servidor`,
        value: `\`\`\`diff\n+ Nombre: ${guild.name}\n+ Propietario: ${bot.users.cache.get(guild.ownerId)?.username}#${bot.users.cache.get(guild.ownerId)?.discriminator}\n+ Server ID: ${guild.id}\n+ Miembros: ${guild.memberCount} (Humanos: ${guild.members.cache.filter((m) => !m.user.bot).size})\n\`\`\``
      })
      .setTimestamp();
      bot.hook.send({ embeds: [embed] });
    } catch (err) {
      bot.logger.writeError(err);
    }
  }
});
