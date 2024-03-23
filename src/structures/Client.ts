import {
  ActivityType,
  Client,
  type ClientOptions
} from "discord.js";

import { ClientHandler } from "./ClientHandler.js";
import { CommandManager } from "./CommandManager.js";
import jsonUtils from "../utils.json" with { type: "json" };

export class MoonlightClient<Ready extends boolean = boolean> extends Client<Ready> {
  private static __instance: MoonlightClient;
  private readonly __handler: ClientHandler = new ClientHandler(this);
  readonly commandsManager: CommandManager = new CommandManager();
  readonly cooldown = new Map<string, Map<string, number>>();
  readonly utils = jsonUtils;

  private constructor(options: ClientOptions) {
    super(options);
  }

  static get Instance(): MoonlightClient {
    if (!MoonlightClient.__instance)
      MoonlightClient.__instance = new MoonlightClient({
        intents: ["Guilds", "GuildMessages", "MessageContent"],
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
}
