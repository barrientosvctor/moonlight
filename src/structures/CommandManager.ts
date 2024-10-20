import { Collection } from "discord.js";
import type {
  CommandManagerPieces,
  CategoryInformation
} from "../types/command.types.js";
import type { LegacyCommandBuilder } from "./CommandBuilder.js";

export class CommandManager implements CommandManagerPieces {
  private readonly __commands = new Collection<string, LegacyCommandBuilder>();
  private readonly __aliases = new Collection<string, string>();
  readonly categories = new Collection<string, CategoryInformation>();

  private formatCommandsName(category: CategoryInformation) {
    return category.commands
      .map(command => `\`${command.slice(0, -3)}\``)
      .join(", ");
  }

  public addCommand(name: string, options: LegacyCommandBuilder) {
    this.__commands.set(name, options);
  }

  public getCommand(name: string) {
    return this.__commands.get(name);
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
}
