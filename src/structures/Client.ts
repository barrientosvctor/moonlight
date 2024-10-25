import { ActivityType, Client, type ClientOptions } from "discord.js";

import { ClientHandler } from "./ClientHandler.js";
import { CommandManager } from "./CommandManager.js";
import {
  type BeautyMessageOptions,
  type EmojiType,
  emojiList,
  type ClientPieces
} from "../types/client.types.js";
import { JSONWrapper } from "./JSONWrapper.js";
import { ClientUtilities } from "./ClientUtilities.js";
import { Database } from "./Database.js";

export class MoonlightClient<Ready extends boolean = boolean>
  extends Client<Ready>
  implements ClientPieces
{
  private static __instance: MoonlightClient;
  private readonly __handler: ClientHandler = new ClientHandler(this);
  readonly commandsManager: CommandManager = new CommandManager();
  readonly cooldown = new Map<string, Map<string, number>>();
  readonly wrapper = new JSONWrapper();
  readonly utils = new ClientUtilities(this);
  readonly database = new Database();

  private constructor(options: ClientOptions) {
    super(options);
  }

  static get Instance(): MoonlightClient {
    if (!MoonlightClient.__instance)
      MoonlightClient.__instance = new MoonlightClient({
        intents: ["Guilds", "GuildMessages", "MessageContent", "GuildMembers"],
        presence: {
          status: "online",
          activities: [
            {
              name: "¡Estoy de vuelta!",
              type: ActivityType.Playing
            }
          ]
        },
        allowedMentions: { repliedUser: false }
      });

    return MoonlightClient.__instance;
  }

  public override async login(token?: string | undefined): Promise<string> {
    const eventHandler = this.__handler.events();
    const commandHandler = this.__handler.commands();
    const contextHandler = this.__handler.contextMenus();
    const slashCommandsHandler = this.__handler.slashCommands();

    const [h1, h2, h3, h4] = await Promise.allSettled([eventHandler, commandHandler, contextHandler, slashCommandsHandler]);

    if (h1.status === "rejected") {
      console.error(h1.reason);
      process.exit(1);
    }

    if (h2.status === "rejected") {
      console.error(h2.reason);
      process.exit(1);
    }

    if (h3.status === "rejected") {
      console.error(h3.reason);
      process.exit(1);
    }

    if (h4.status === "rejected") {
      console.error(h4.reason);
      process.exit(1);
    }

    await this.database.createDatabaseFile();
    // Read before add new registers to database will not overwrite the last registers.
    await this.database.read();
    const tok = await super.login(token);

    // TODO: Add slash commands initialization

    return tok;
  }

  public getEmoji(type: EmojiType) {
    if (typeof emojiList[type] === "object")
      return emojiList[type][
        Math.floor(Math.random() * emojiList[type].length)
      ];

    return emojiList[type];
  }

  public beautifyMessage(message: string, data: Partial<BeautyMessageOptions>) {
    let emojiField = "";
    let mentionField = "";

    if (data.emoji && this.getEmoji(data.emoji))
      emojiField = `${this.getEmoji(data.emoji)} ~ `;
    if (data.mention) {
      mentionField = `**${data.mention}**, `;
      const msgArray = Array.from(message);
      msgArray[0] = msgArray[0].toLowerCase();
      message = msgArray.join("");
    }

    return `${emojiField}${mentionField}${message}`;
  }

  public getPrefix(guildId: string) {
    if (this.database.has("prefix", guildId))
      return this.database.get("prefix", guildId)!;

    return "!!";
  }
}
