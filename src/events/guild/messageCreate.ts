import { Message } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "messageCreate",
    async run(bot, msg: Message) {
        try {
            const prefix: string = "!!";
            const args: Array<string> = msg.content.substring(prefix.length).split(" ");
            const command: CommandBuilder | undefined = bot.commands.get(args![0]) || bot.commands.get(bot.aliases.get(args[0])!)

            if (!args[0] || !msg.guild || msg.author.bot || !msg.content.startsWith(prefix)) return;

            if (command) {
                if (command.ownerOnly && !bot.isOwner(msg.author)) return;
                if (!bot.isOwner(msg.author)) return msg.channel.send("Los comandos no están disponibles en este momento.");

                try {
                    command.run(bot, msg, args, prefix);
                } catch (error) {
                    console.error(error);
                }
            } else return;
        } catch (err) {
            console.error(err);
        }
    }
});