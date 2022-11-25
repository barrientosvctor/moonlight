import { Message, TextChannel } from "discord.js";
import Type from "../../Moonlight";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "messageDelete",
    async run(bot, msg: Message) {
        try {
            bot.snipes.set(msg.channel.id, {
                content: msg.content || null,
                channel: msg.channel instanceof TextChannel ? msg.channel : null,
                image: msg.attachments.first().proxyURL || null,
                msgAuthor: msg.member.user.tag,
                time: Date.now()
            });
        } catch (err) {
            bot.error("Error en evento", { name: "messageDelete", type: Type.Event, error: err });
        }
    }
});
