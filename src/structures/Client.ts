import {
  ActivityType,
  Client,
  type ClientOptions
} from "discord.js";

import { ClientHandler } from "./ClientHandler.js";

export class MoonlightClient<Ready extends boolean = boolean> extends Client<Ready> {
  private static __instance: MoonlightClient;
  private readonly __handler: ClientHandler = new ClientHandler(this);

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

    await eventHandler;
    return await super.login(token);
  }
}
