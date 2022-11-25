import { Client, Collection, DiscordAPIError, DMChannel, EmbedBuilder, GuildMember, NewsChannel, PartialDMChannel, PrivateThreadChannel, PublicThreadChannel, TextChannel, User, VoiceChannel, WebhookClient } from "discord.js";
import { MoonlightDatabase } from "./databases";
import { CommandHandler, ContextMenuHandler, EventHandler } from "./handlers";
import { CommandBuilder } from "./structures/CommandBuilder";
import { ContextMenuBuilder } from "./structures/ContextMenuBuilder";
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
    love: string | Array<string>;
}

interface ReplyMessageDataOptions {
    mention: string;
    emoji: string;
}

interface MoonlightClassContent {
    commands: Collection<string, CommandBuilder>;
    slash: Collection<string, ContextMenuBuilder>;
    categories: Collection<string, { name: string; commands: Array<string>; }>;
    aliases: Collection<string, string>;
    hook: WebhookClient;
    utils: typeof validations;
    blacklist_url_list: Array<string>;
    nsfw_url_list: Array<string>;
    begin(): void;
    getPrefix(databaseKey: string): Promise<string>;
    error(message: string, data: ErrorDataOptions): void;
    getEmoji(emojiName: string) : string | Array<string> | undefined;
    replyMessage(message: string, data: ReplyMessageDataOptions): string;
    rps(player1: string, player2: string): string;
    shipPercent(result: number): string;
    isOwnerCommand(commandName: string): boolean;
    isOwner(user: GuildMember | User): boolean;
}

export class Moonlight extends Client implements MoonlightClassContent {
    public constructor() {
        super({ intents: 33743, allowedMentions: { repliedUser: false } });
    }

    public commands: Collection<string, CommandBuilder> = new Collection();
    public slash: Collection<string, ContextMenuBuilder> = new Collection();
    public categories: Collection<string, { name: string; commands: Array<string>; }> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public hook: WebhookClient = new WebhookClient({ id: process.env.HOOK_ID!, token: process.env.HOOK_TOKEN! });
    public utils = validations;
    public blacklist_url_list: Array<string> = ["whatismyip.com", "bit.ly", "adf.ly", "is.gd", "tinyurl.com", "iplogger.com", "discords.gift", "discord.gift", "whatsmyip.com", "whatsmyip.org", "whatismyipaddress.com"];
    public nsfw_url_list: Array<string> = ["pornhub.com", "nhentai.to", "hentaila.com", "hentaihaven.xxx", "rule34.xxx", "xvideos.com", "xnxx.com", "chochox.com", "4tube.com", "goku.com", "porn.com", "nhentai.xxx", "nhentai.io", "nhentai.net"];

    public begin(): void {
        CommandHandler(this);
        EventHandler(this);
        ContextMenuHandler(this);
        this.login(process.env.BOT_TOKEN);
    }

    public async getPrefix(databaseKey: string): Promise<string> {
        let prefix: string;
        const db = new MoonlightDatabase("prefix.json");
        if (db.has(databaseKey)) prefix = await db.get(databaseKey) as string;
        else prefix = "!!";

        return prefix;
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
        const emojiList: Required<EmojiListStructure> = {
            check: ["✅"],
            error: ["❌"],
            noargs: ["❗"],
            sad: ["😔", "😕", "😞", "😟", "🙁", "☹️", "😢", "😭"],
            tada: ["🎉"],
            wait: ["<a:waiting:1019010655434571969>"],
            warning: ["⚠️"],
            love: ["❤️"]
        }

        const emoji: keyof EmojiListStructure = emojiName as keyof EmojiListStructure || undefined;

        if (!emojiList[emoji]) return undefined
        else if (typeof emojiList[emoji] === "object") return emojiList[emoji][Math.floor(Math.random() * emojiList[emoji].length)];
        else if (typeof emojiList[emoji] === "string") return emojiList[emoji];
    }

    public replyMessage(message: string, data: Partial<ReplyMessageDataOptions>): string {
	let messageContent: string = "";
	let emojiField: string = "";
        let mentionField: string = "";

        if (data.emoji && this.getEmoji(data.emoji)) emojiField = `${this.getEmoji(data.emoji)} ~ ` || "";
        if (data.mention) mentionField = `**${data.mention}**, ` || "";

        messageContent = `${emojiField}${mentionField}${message}`;
        return messageContent;
    }

    public rps(player1: string, player2: string): string {
        const vs = `${player1} vs. ${player2}\n`
        if (player1 === player2) return vs + "**¡Empate!**";

        const results = {
            piedra: {
                tijera: true,
                papel: false
            },
            papel: {
                piedra: true,
                tijera: false
            },
            tijera: {
                papel: true,
                piedra: false
            }
        }

        if (results[player1][player2]) return vs + "**¡Ganaste!**";
        else return vs + `**¡Ganó ${this.user.username}!**`;
    }

    public shipPercent(result: number): string {
        if (result < 0 && result > 100) throw new Error("[ShipPercent] No puedes poner un número menor a 0 ni mayor a 100.");
        if(result >= 1 && result <= 10) return `Se llevan súper mal.\n\n🟥⬛⬛⬛⬛⬛⬛⬛⬛⬛`;
        else if (result >= 11 && result <= 20) return `Apenas y se soportan.\n\n🟥🟥⬛⬛⬛⬛⬛⬛⬛⬛`;
        else if (result >= 21 && result <= 30) return `Parece que no son lo suyo.\n\n🟥🟥🟥⬛⬛⬛⬛⬛⬛⬛`;
        else if (result >= 31 && result <= 40) return `Podría no funcionar.\n\n🟥🟥🟥🟥⬛⬛⬛⬛⬛⬛`;
        else if (result >= 41 && result <= 50) return `Hmmm.\n\n🟥🟥🟥🟥🟥⬛⬛⬛⬛⬛`;
        else if (result >= 51 && result <= 60) return `Punto medio.\n\n🟥🟥🟥🟥🟥🟥⬛⬛⬛⬛`;
        else if (result >= 61 && result <= 70) return `Puede haber algo entre ellos...\n\n🟥🟥🟥🟥🟥🟥🟥⬛⬛⬛`;
        else if (result >= 71 && result <= 80) return `👀\n\n🟥🟥🟥🟥🟥🟥🟥🟥⬛⬛`;
        else if (result >= 81 && result <= 90) return `❤️\n\n🟥🟥🟥🟥🟥🟥🟥🟥🟥⬛`;
        else if (result >= 91 && result <= 100) return `💓\n\n🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥`;
        else return `No hay nada que hacer.\n\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`;
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
