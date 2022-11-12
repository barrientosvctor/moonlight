import { Client, Collection, DiscordAPIError, DMChannel, EmbedBuilder, GuildMember, NewsChannel, PartialDMChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel, User, VoiceChannel, WebhookClient } from "discord.js";
import { CommandHandler, EventHandler } from "./handlers";
import { CommandBuilder } from "./structures/CommandBuilder";
import validations from "./utils/validations.json";

enum Type {
    Command = 1,
    Event = 2
}

interface ErrorDataOptions {
    name: string;
    type: Type;
    channel?: DMChannel | PartialDMChannel | NewsChannel | TextChannel | PrivateThreadChannel | PublicThreadChannel<true> | VoiceChannel;
    error: Error | DiscordAPIError | unknown;
}

interface EmojiListStructure {
    check: string | Array<string>;
    error: string | Array<string>;
    noargs: string | Array<string>;
    sad: string | Array<string>;
    tada: string | Array<string>;
    wait: string | Array<string>;
    warning: string | Array<string>;
}

interface ReplyMessageDataOptions {
    mention?: string;
    emoji?: string;
}

interface MoonlightClassContent {
    commands: Collection<string, CommandBuilder>;
    categories: Collection<string, { name: string; commands: Array<string>; }>;
    aliases: Collection<string, string>;
    hook: WebhookClient;
    utils: typeof validations;
    begin(): void;
    error(message: string, data: ErrorDataOptions): void;
    getEmoji(emojiName: string) : string | Array<string> | undefined;
    replyMessage(message: string, data: ReplyMessageDataOptions): string;
    isOwnerCommand(commandName: string): boolean;
    isOwner(user: GuildMember | User): boolean;
}

export class Moonlight extends Client implements MoonlightClassContent {
    public constructor() {
        super({ intents: 33743, allowedMentions: { repliedUser: false } });
    }

    public commands: Collection<string, CommandBuilder> = new Collection();
    public categories: Collection<string, { name: string; commands: Array<string>; }> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public hook: WebhookClient = new WebhookClient({ id: process.env.HOOK_ID!, token: process.env.HOOK_TOKEN! });
    public utils = validations;

    public begin(): void {
        CommandHandler(this);
        EventHandler(this);
        this.login(process.env.BOT_TOKEN);
    }

    public error(message: string, data: ErrorDataOptions): void {
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

    public getEmoji(emojiName: string): Array<string> | string | undefined {
        const emojiList: EmojiListStructure = {
            check: ["✅"],
            error: ["❌"],
            noargs: ["❗"],
            sad: ["😔", "😕", "😞", "😟", "🙁", "☹️", "😢", "😭"],
            tada: [],
            wait: ["<a:waiting:1019010655434571969>"],
            warning: ["⚠️"]
        }

        const emoji: keyof EmojiListStructure = emojiName as keyof EmojiListStructure || undefined;

        if (!emojiList[emoji]) return undefined
        else if (typeof emojiList[emoji] === "object") return emojiList[emoji][Math.floor(Math.random() * emojiList[emoji].length)];
        else if (typeof emojiList[emoji] === "string") return emojiList[emoji];
    }

    public replyMessage(message: string, data: ReplyMessageDataOptions): string {
	let messageContent: string = "";
	let emojiField: string = "";
        let mentionField: string = "";

        if (data.emoji && this.getEmoji(data.emoji)) emojiField = `${this.getEmoji(data.emoji)} ~ ` || "";
        if (data.mention) mentionField = `**${data.mention}**, ` || "";

        messageContent = `${emojiField}${mentionField}${message}`;
        return messageContent;
    }

    public isOwnerCommand(commandName: string): boolean {
        const commandsList: Array<string> = this.categories.filter(category => category.name === "Desarrollador").map(category => category.commands.toString().slice(0, -3));

        if (commandsList.includes(commandName)) return true;
        else return false;
    }

    public isOwner(user: GuildMember | User): boolean {
        if ([this.application?.owner?.id].includes(user.id)) return true;
        else return false;
    }
}

export default Type
