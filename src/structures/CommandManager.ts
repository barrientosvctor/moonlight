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
    console.log("-------------- SLASH COMMANDS COLLECTION ---------------");

    console.log(this.__slashcommands);

    const slashCommandsData = this.__slashcommands.map(slash => slash.data.toJSON());
    const contextMenusData = this.__contextmenus.map(ctx => ctx.data.toJSON());

    if (this.__client.user) {
      // TODO: Add guild commands registerer
      await this.__client.rest.put(Routes.applicationCommands(this.__client.user.id), {
        body: slashCommandsData
      });

      console.log(`Successfully reloaded ${slashCommandsData.length} slash (/) commands!`);
    } else {
      console.log(`I couldn't reload slash (/) commands.`);
    }
  }
}
