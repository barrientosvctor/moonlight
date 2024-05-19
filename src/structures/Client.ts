import { ActivityType, Client, type Snowflake, type ClientOptions } from "discord.js";

import { ClientHandler } from "./ClientHandler.js";
import { CommandManager } from "./CommandManager.js";
import {
  type BeautyMessageOptions,
  type EmojiType,
  emojiList,
  type ClientPieces,
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
        intents: ["Guilds", "GuildMessages", "MessageContent"],
        presence: {
          status: "dnd",
          activities: [
            {
              name: "Reconstrucción...",
              type: ActivityType.Watching
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

    const [h1, h2] = await Promise.allSettled([eventHandler, commandHandler]);

    if (h1.status === "rejected") {
      console.error(h1.reason);
      process.exit(1);
    }

    if (h2.status === "rejected") {
      console.error(h2.reason);
      process.exit(1);
    }

    await this.database.createDatabaseFile();
    // Read before add new registers to database will not overwrite the last registers.
    await this.database.read();
    return await super.login(token);
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

  public getPrefix(guildId: Snowflake) {
    if (this.database.has("prefix", guildId))
      return this.database.get("prefix", guildId)!;

    return "!!";
  }
}
