import { ActivityType, Client } from "discord.js";
import type { ClientOptions } from "discord.js";
import { ClientHandler } from "./ClientHandler.js";

export class MoonlightClient extends Client {
  private static __instance: MoonlightClient;
  private readonly __handler = new ClientHandler(this);

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
