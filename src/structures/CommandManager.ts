import { Collection, Routes } from "discord.js";
import type { ContextMenu, SlashCommand } from "./CommandBuilder.js";
import type { MoonlightClient } from "./Client.js";

export class CommandManager {
  private readonly __slashcommands = new Collection<string, SlashCommand>();
  private readonly __contextmenus = new Collection<string, ContextMenu>();

  public constructor(private readonly __client: MoonlightClient) {}

  public addSlashCommand(name: string, options: SlashCommand) {
    this.__slashcommands.set(name, options);
  }

  public addContextMenuCommand(name: string, options: ContextMenu) {
    this.__contextmenus.set(name, options);
  }

  public getSlashCommand(name: string) {
    return this.__slashcommands.get(name);
  }

  public getContextMenuCommand(name: string) {
    return this.__contextmenus.get(name);
  }

  public async registerApplicationCommands() {
    const globalSlashCommandsData = this.__slashcommands.map(slash =>
      slash.data.toJSON()
    );
    const globalContextMenusData = this.__contextmenus.map(ctx =>
      ctx.data.toJSON()
    );
    const commands = [globalSlashCommandsData, globalContextMenusData].flat();

    if (this.__client.user) {
      if (commands.length > 0) {
        try {
          await this.__client.rest.put(
            Routes.applicationCommands(this.__client.user.id),
            {
              body: commands
            }
          );

          console.log("Slash (/) commands successfully reloaded!");
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.log("I can't reload commands because client is not connected.");
    }
  }
}
