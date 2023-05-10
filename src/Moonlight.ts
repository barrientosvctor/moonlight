import { Client, Collection, GuildMember, TextChannel, User, WebhookClient } from "discord.js";
import { MoonlightDatabase } from "./databases";
import { CommandHandler, ContextMenuHandler, EventHandler } from "./handlers";
import { CommandBuilder } from "./structures/CommandBuilder";
import { ContextMenuBuilder } from "./structures/ContextMenuBuilder";
import { Logger } from "./structures/Logger";
import { IEmojiListStructure, IMoonlightClassContent, IReplyMessageDataOptions } from "./types/bot";
import validations from "./utils/validations.json";

export class Moonlight extends Client implements IMoonlightClassContent {
  public constructor() {
    super({ intents: 33743, allowedMentions: { repliedUser: false } });
  }

  public commands: Collection<string, CommandBuilder> = new Collection();
  public slash: Collection<string, ContextMenuBuilder> = new Collection();
  public categories: Collection<string, { name: string; commands: Array<string>; }> = new Collection();
  public aliases: Collection<string, string> = new Collection();
  public hook: WebhookClient = new WebhookClient({ id: process.env.HOOK_ID!, token: process.env.HOOK_TOKEN! });
  public utils = validations;
  public logger: Logger = Logger.getInstance();
  public blacklist_url_list: Array<string> = ["whatismyip.com", "bit.ly", "adf.ly", "is.gd", "tinyurl.com", "iplogger.com", "discords.gift", "discord.gift", "whatsmyip.com", "whatsmyip.org", "whatismyipaddress.com"];
  public nsfw_url_list: Array<string> = ["pornhub.com", "nhentai.to", "hentaila.com", "hentaihaven.xxx", "rule34.xxx", "xvideos.com", "xnxx.com", "chochox.com", "4tube.com", "goku.com", "porn.com", "nhentai.xxx", "nhentai.io", "nhentai.net"];

  public begin(): void {
    this.logger.createDirectory();
    CommandHandler(this);
    EventHandler(this);
    ContextMenuHandler(this);
    this.login(process.env.BOT_TOKEN);
  }

  public async getPrefix(databaseKey: string): Promise<string> {
    let prefix: string;
    const db = new MoonlightDatabase("prefix.json");
    if (db.has(databaseKey)) prefix = await db.get(databaseKey) as string;

    return prefix || "!!";
  }

  public getEmoji(emojiName: string): Array<string> | string | undefined {
    const emojiList: Required<IEmojiListStructure> = {
      check: ["✅"],
      error: ["❌"],
      noargs: ["❗"],
      sad: ["😔", "😕", "😞", "😟", "🙁", "☹️", "😢", "😭"],
      tada: ["🎉"],
      wait: ["<a:waiting:1019010655434571969>"],
      warning: ["⚠️"],
      love: ["❤️"]
    }

    const emoji: keyof IEmojiListStructure = emojiName as keyof IEmojiListStructure || undefined;

    if (!emojiList[emoji]) return undefined;
    else if (typeof emojiList[emoji] === "object") return emojiList[emoji][Math.floor(Math.random() * emojiList[emoji].length)];
    else if (typeof emojiList[emoji] === "string") return emojiList[emoji];
  }

  public replyMessage(message: string, data: Partial<IReplyMessageDataOptions>): string {
    let emojiField: string = "";
    let mentionField: string = "";

    if (data.emoji && this.getEmoji(data.emoji)) emojiField = `${this.getEmoji(data.emoji)} ~ ` || "";
    if (data.mention) mentionField = `**${data.mention}**, ` || "";

    return `${emojiField}${mentionField}${message}`;
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

  public sendErrorMessage(fn: any) {
    if (!(fn instanceof TextChannel)) return;

    return fn.send(`:x: Hubo un error al intentar ejecutar el comando.`);
  }
}
