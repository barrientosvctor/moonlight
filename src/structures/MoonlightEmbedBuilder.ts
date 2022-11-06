import { EmbedBuilder, EmbedData, Guild, User } from "discord.js"

export class MoonlightEmbedBuilder extends EmbedBuilder {
    public constructor(author: User, guild: Guild, data: EmbedData = {}) {
        super(data);

        this.setColor("Random")
        this.setAuthor({ name: author.tag, iconURL: author.displayAvatarURL({ size: 2048, extension: "png" }) })
        this.setFooter({ text: guild.name, iconURL: guild.iconURL({ size: 2048, extension: "png" }) || undefined })
        this.setTimestamp();
    }
}