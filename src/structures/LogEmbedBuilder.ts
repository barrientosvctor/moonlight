import { EmbedBuilder, EmbedData } from "discord.js";

enum EventNameType {
    "messageCreate" = "Mensaje nuevo enviado"
}

export class LogEmbedBuilder extends EmbedBuilder {
    public constructor(eventName: EventNameType, message: string, data: EmbedData = {}) {
        super(data);

        this.setColor("Random")
        this.setTitle(eventName)
        this.setDescription(message)
        this.setTimestamp();
    }
}