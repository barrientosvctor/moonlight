import { ChannelType, EmbedBuilder, GuildTextBasedChannel } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getChannel } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "channelinfo",
  cooldown: 5,
  category: "Información",
  description: "Te da meta datos sobre el canal que menciones. Sino daré por hecho que te refieres al canal en el que estás.",
  aliases: ["chinfo"],
  usage: "[#canal | <id>]",
  example: "#general",
  run(client, message, args) {
    const channel = getChannel(args[1], message) || message.channel as GuildTextBasedChannel;
    if (!channel)
      return message.reply(client.beautifyMessage("No se pudo encontrar ese canal.", { emoji: "error" }))

    const embed = new EmbedBuilder()
    .setTitle(`Información del canal #${channel.name}`)
    .setColor("Random");
    let info = "";

    switch (channel.type) {
      case ChannelType.GuildText:
        info = `**Posición:** ${channel.position}\n**Descripción:** ${channel.topic || "Ninguno"}\n**NSFW:** ${channel.nsfw ? "Sí" : "No"}\n**Modo lento:** ${channel.rateLimitPerUser > 0 ? "Activado" : "Desactivado"}`;
      break;
      case ChannelType.GuildVoice:
        info = `**Posición:** ${channel.position}\n**Tasa de bits:** ${channel.bitrate}\n**Límite de usuarios:** ${channel.userLimit}`;
      break;
      case ChannelType.GuildAnnouncement:
        info = `**Posición:** ${channel.position}`;
      break;
    }

    embed.setDescription(`**ID:** ${channel.id}\n${info}`);

    return message.reply({ embeds: [embed] });
  }
});
