import {
  ActivityType,
  Client,
  type ClientOptions
} from "discord.js";

import { ClientHandler } from "./ClientHandler.js";
import { CommandManager } from "./CommandManager.js";
import {
  type BeautyMessageOptions,
  type EmojiType,
  emojiList,
  type ClientPieces
} from "../types/client.types.js";
import { JSONWrapper } from "./JSONWrapper.js";
import { CommandType } from "../types/command.types.js";

export class MoonlightClient<Ready extends boolean = boolean> extends Client<Ready> implements ClientPieces {
  private static __instance: MoonlightClient;
  private readonly __handler: ClientHandler = new ClientHandler(this);
  readonly commandsManager: CommandManager = new CommandManager();
  readonly cooldown = new Map<string, Map<string, number>>();
  readonly wrapper = new JSONWrapper();

  private constructor(options: ClientOptions) {
    super(options);
  }

  static get Instance(): MoonlightClient {
    if (!MoonlightClient.__instance)
      MoonlightClient.__instance = new MoonlightClient({
        intents: ["Guilds", "GuildMessages", "MessageContent", "GuildPresences"],
        presence: {
          status: "dnd",
          activities: [{
            name: "Reconstrucción...",
            type: ActivityType.Watching
          }]
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

    return await super.login(token);
  }

  public getEmoji(type: EmojiType) {
    if (typeof emojiList[type] === "object")
      return emojiList[type][Math.floor(Math.random() * emojiList[type].length)];

    return emojiList[type];
  }

  public beautifyMessage(message: string, data: Partial<BeautyMessageOptions>) {
    let emojiField = "";
    let mentionField = "";

    if (data.emoji && this.getEmoji(data.emoji)) emojiField = `${this.getEmoji(data.emoji)} ~ `;
    if (data.mention) {
      mentionField = `**${data.mention}**, `;
      const msgArray = Array.from(message);
      msgArray[0] = msgArray[0].toLowerCase();
      message = msgArray.join("");
    }

    return `${emojiField}${mentionField}${message}`;
  }

  public receiveCommand(argument: string) {
    return this.commandsManager.getCommand(argument, CommandType.Legacy) || this.commandsManager.getCommandByAlias(argument);
  }

  /**
   * This is used with `PermissionResolvable.toString()`
   * It takes the permissions string and convert it to its Spanish version on a new array.
   *
   * @param {string} perms
   */
  public convertPermissionStringToArray(perms: string) {
    const permsArray = perms.split(/[, ]/g);
    return permsArray.map(perm => this.wrapper.get("guild.roles.permissions", perm));
  }
}
