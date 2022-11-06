import { Client, Collection, GuildMember, User, WebhookClient } from "discord.js";
import { CommandHandler, EventHandler } from "./handlers";
import { CommandBuilder } from "./structures/CommandBuilder";

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

    public isOwnerCommand(commandName: string): boolean {
        const commandsList = this.categories.filter(ae => ae.name === "Desarrollador").map(ae => ae.commands.toString().slice(0, -3));

        if (commandsList.includes(commandName)) return true;
        else return false;
    }

    public isOwner(user: GuildMember | User): boolean {
        if ([this.application?.owner?.id].includes(user.id)) return true;
        else return false;
    }
}