import { Collection } from "discord.js";
import type { CommandType } from "../types/command.types.js";
import type {
  CommandManagerPieces,
  CategoryInformation
} from "../types/command.types.js";
import type { CommandBuilder } from "./CommandBuilder.js";


export class CommandManager implements CommandManagerPieces {
  private readonly __commands = new Collection<string, CommandBuilder>();
  readonly categories = new Collection<string, CategoryInformation>();

  private formatCommandsName(category: CategoryInformation) {
    return category.commands.map((command) => `\`${command.slice(0, -3)}\``).join(", ");
  }

  public addCommand(name: string, options: CommandBuilder) {
    this.__commands.set(name, options);
  }

  public getCommand<Type extends CommandType>(name: string, type: Type) {
    return this.__commands.filter(command => command.type === type).get(name) as CommandBuilder<Type> | undefined;
  }

  public showCommandsList() {
    if (!this.categories.toJSON().length)
      return "No hay comandos disponibles.";

    return this.categories.filter((c) => c.name !== "dev").map((category) => {
      const formattedCommandsName = this.formatCommandsName(category);
      return `**${category.name}**\n${formattedCommandsName}`;
    }).join("\n\n");
  }
}