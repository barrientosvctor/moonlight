import { BaseGuildTextChannel, Client, Collection, DiscordAPIError, EmbedBuilder, GuildMember, User, WebhookClient } from "discord.js";
import { CommandHandler, EventHandler } from "./handlers";
import { CommandBuilder } from "./structures/CommandBuilder";

enum Type {
    Command = 1,
    Event = 2
}

interface ErrorDataOptions {
    name: string;
    type: Type;
    channel?: BaseGuildTextChannel | WebhookClient;
    error: Error | DiscordAPIError;
}

export class Moonlight extends Client {
    public constructor() {
        super({ intents: 33743, allowedMentions: { repliedUser: false } });
    }

    public commands: Collection<string, CommandBuilder> = new Collection();
    public categories: Collection<string, { name: string; commands: Array<string>; }> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public hook: WebhookClient = new WebhookClient({ id: process.env.HOOK_ID!, token: process.env.HOOK_TOKEN! });

    public begin(): void {
        CommandHandler(this);
        EventHandler(this);
        this.login(process.env.BOT_TOKEN);
    }

    public error(message: string, data: ErrorDataOptions) {
        const errorEmbed = new EmbedBuilder();
        errorEmbed.setDescription(`\`\`\`\n${data.error}\n\`\`\``)
        errorEmbed.setFooter({ text: "Moonlight Logs", iconURL: this.user?.displayAvatarURL() })

        if (data.type === Type.Command) {
            errorEmbed.setTitle(`Comando: ${data.name}`);
        } else {
            errorEmbed.setTitle(`Evento: ${data.name}`);
        }

        this.hook.send({ embeds: [errorEmbed] });
        if (data.channel) data.channel.send(`❌ ${message}`);
        console.error(data.error);
    }

    public isOwnerCommand(commandName: string): boolean {
        const commandsList: Array<string> = this.categories.filter(ae => ae.name === "Desarrollador").map(ae => ae.commands.toString().slice(0, -3));

        if (commandsList.includes(commandName)) return true;
        else return false;
    }

    public isOwner(user: GuildMember | User): boolean {
        if ([this.application?.owner?.id].includes(user.id)) return true;
        else return false;
    }
}

export default Type