import { Collection, Routes } from "discord.js";
import type {
  CommandManagerPieces,
  CategoryInformation
} from "../types/command.types.js";
import type {
  ContextMenu,
  LegacyCommandBuilder,
  SlashCommand
} from "./CommandBuilder.js";
import type { MoonlightClient } from "./Client.js";
import { GUILD_ID } from "../constants.js";

export class CommandManager implements CommandManagerPieces {
  private readonly __commands = new Collection<string, LegacyCommandBuilder>();
  private readonly __slashcommands = new Collection<string, SlashCommand>();
  private readonly __contextmenus = new Collection<string, ContextMenu>();
  private readonly __aliases = new Collection<string, string>();
  readonly categories = new Collection<string, CategoryInformation>();

  public constructor(private readonly __client: MoonlightClient) {}

  private formatCommandsName(category: CategoryInformation) {
    return category.commands
      .map(command => `\`${command.slice(0, -3)}\``)
      .join(", ");
  }

  public addCommand(name: string, options: LegacyCommandBuilder) {
    this.__commands.set(name, options);
  }

  public addSlashCommand(name: string, options: SlashCommand) {
    this.__slashcommands.set(name, options);
  }

  public addContextMenuCommand(name: string, options: ContextMenu) {
    this.__contextmenus.set(name, options);
  }

  public getCommand(name: string) {
    return this.__commands.get(name);
  }

  public getSlashCommand(name: string) {
    return this.__slashcommands.get(name);
  }

  public getContextMenuCommand(name: string) {
    return this.__contextmenus.get(name);
  }

  public showCommandsList() {
    if (!this.categories.toJSON().length) return "No hay comandos disponibles.";

    return this.categories
      .filter(c => c.name !== "Desarrollador")
      .map(category => {
        const formattedCommandsName = this.formatCommandsName(category);
        return `**${category.name}**\n${formattedCommandsName}`;
      })
      .join("\n\n");
  }

  public addAliasToCommand(alias: string, command: string) {
    this.__aliases.set(alias, command);
  }

  public getCommandByAlias(alias: string) {
    const cmd = this.__aliases.get(alias);
    if (!cmd) return undefined;

    return this.getCommand(cmd);
  }

  public async registerApplicationCommands() {
    const [globalSlashCommandsData, guildSlashCommandsData] = [
      this.__slashcommands.filter(slash => !slash.testGuildOnly).map(slash => slash.data.toJSON()),
      this.__slashcommands.filter(slash => slash.testGuildOnly).map(slash => slash.data.toJSON())
    ];
    const [globalContextMenusData, guildContextMenusData] = [
      this.__contextmenus.filter(ctx => !ctx.testGuildOnly).map(ctx => ctx.data.toJSON()),
      this.__contextmenus.filter(ctx => ctx.testGuildOnly).map(ctx => ctx.data.toJSON())
    ];

    if (this.__client.user) {
      if (guildSlashCommandsData.length) {
        await this.__client.rest.put(Routes.applicationGuildCommands(this.__client.user.id, GUILD_ID), {
          body: guildSlashCommandsData
        });
        console.log(`Successfully reloaded ${guildSlashCommandsData.length} guild slash (/) commands!`);
      }

      if (globalSlashCommandsData.length) {
        await this.__client.rest.put(Routes.applicationCommands(this.__client.user.id), {
          body: globalSlashCommandsData
        });

        console.log(`Successfully reloaded ${globalSlashCommandsData.length} slash (/) commands!`);
      }

      if (guildContextMenusData.length) {
        await this.__client.rest.put(Routes.applicationGuildCommands(this.__client.user.id, GUILD_ID), {
          body: guildContextMenusData
        });

        console.log(`Successfully reloaded ${guildContextMenusData.length} guild context menus commands!`);
      }

      if (globalContextMenusData.length) {
        await this.__client.rest.put(Routes.applicationCommands(this.__client.user.id), {
          body: globalContextMenusData
        });
        console.log(`Successfully reloaded ${globalContextMenusData.length} context menus commands!`);
      }
    } else {
      console.log(`I couldn't reload application commands.`);
    }
  }
}
