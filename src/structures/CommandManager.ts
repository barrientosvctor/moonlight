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
    const [
      globalSlashCommandsData,
      guildSlashCommandsData,
      disabledSlashCommands
    ] = [
      this.__slashcommands
        .filter(slash => !slash.testGuildOnly && slash.enabled)
        .map(slash => slash.data.toJSON()),
      this.__slashcommands
        .filter(slash => slash.testGuildOnly)
        .map(slash => slash.data.toJSON()),
      this.__slashcommands.filter(slash => !slash.enabled)
    ];
    const [globalContextMenusData, guildContextMenusData] = [
      this.__contextmenus
        .filter(ctx => !ctx.testGuildOnly)
        .map(ctx => ctx.data.toJSON()),
      this.__contextmenus
        .filter(ctx => ctx.testGuildOnly)
        .map(ctx => ctx.data.toJSON())
    ];

    if (this.__client.user) {
      if (guildSlashCommandsData.length) {
        await this.__client.rest.put(
          Routes.applicationGuildCommands(
            this.__client.user.id,
            process.env.TESTING_GUILD_ID
          ),
          {
            body: guildSlashCommandsData
          }
        );
        console.log(
          `Successfully reloaded ${guildSlashCommandsData.length} guild slash (/) commands!`
        );

        if (disabledSlashCommands.size > 0)
          console.log(
            `Sucessfully reloaded ${disabledSlashCommands.size} **DISABLED** slash (/) commands (ONLY AVAILABLE IN TESTING GUILD).`
          );
      }

      if (globalSlashCommandsData.length) {
        await this.__client.rest.put(
          Routes.applicationCommands(this.__client.user.id),
          {
            body: globalSlashCommandsData
          }
        );

        console.log(
          `Successfully reloaded ${globalSlashCommandsData.length} slash (/) commands!`
        );
      }

      if (guildContextMenusData.length) {
        await this.__client.rest.put(
          Routes.applicationGuildCommands(
            this.__client.user.id,
            process.env.TESTING_GUILD_ID
          ),
          {
            body: guildContextMenusData
          }
        );

        console.log(
          `Successfully reloaded ${guildContextMenusData.length} guild context menus commands!`
        );
      }

      if (globalContextMenusData.length) {
        await this.__client.rest.put(
          Routes.applicationCommands(this.__client.user.id),
          {
            body: globalContextMenusData
          }
        );
        console.log(
          `Successfully reloaded ${globalContextMenusData.length} context menus commands!`
        );
      }
    } else {
      console.log(`I couldn't reload application commands.`);
    }
  }
}
