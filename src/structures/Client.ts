import { ActivityType, Client, type ClientOptions } from "discord.js";

import { ClientHandler } from "./ClientHandler.js";
import { CommandManager } from "./CommandManager.js";
import {
  type BeautyMessageOptions,
  type EmojiType,
  emojiList
} from "../types/client.types.js";
import { JSONWrapper } from "./JSONWrapper.js";
import { ClientUtilities } from "./ClientUtilities.js";
import { Database } from "./Database.js";

export class MoonlightClient<
  Ready extends boolean = boolean
> extends Client<Ready> {
  private static __instance: MoonlightClient;
  private readonly __handler: ClientHandler = new ClientHandler(this);
  readonly commandsManager: CommandManager = new CommandManager(this);
  readonly cooldown = new Map<string, Map<string, number>>();
  readonly wrapper = new JSONWrapper();
  readonly utils = new ClientUtilities(this);

  private constructor(options: ClientOptions) {
    super(options);
  }

  static get Instance(): MoonlightClient {
    if (!MoonlightClient.__instance)
      MoonlightClient.__instance = new MoonlightClient({
        intents: ["Guilds", "GuildMessages", "GuildMembers"],
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
    await this.__handler.events();
    await this.__handler.slashCommands();
    await this.__handler.contextMenus();

    await Database.instance.createDatabaseFile();
    // Read before add new registers to database will not overwrite the last registers.
    await Database.instance.read();
    const tok = await super.login(token);

    await this.commandsManager.registerApplicationCommands();

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
}
