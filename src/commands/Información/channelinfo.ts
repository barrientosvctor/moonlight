import { ChannelType, GuildTextBasedChannel } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "channelinfo",
    description: "Muestra información del canal que menciones.",
    cooldown: 3,
    aliases: ["chinfo", "channelinf", "chinf"],
    usage: "[#canal | ID]",
    example: "#general",
    enabled: true,
    async run(bot, msg, args, prefix, getUser, getMember, getChannel) {
        try {
            const channel = getChannel(args[1]) || msg.channel as GuildTextBasedChannel;
            if (!channel) return msg.reply(bot.replyMessage("Este canal no existe en el servidor.", { emoji: "error" }));

            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!);
            let info: string = "";

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

            embed.setTitle(`Información del canal #${channel.name}`)
            embed.setDescription(`**Nombre:** ${channel.name}\n**ID:** ${channel.id}\n${info}`);

            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar obtener información del canal.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
