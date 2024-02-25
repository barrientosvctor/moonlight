import { Collection } from "discord.js";
import type { CommandType } from "../types/command.types.js";
import type { CommandManagerPieces } from "../types/command.types.js";
import type { CommandBuilder } from "./CommandBuilder.js";

export class CommandManager implements CommandManagerPieces {
  private readonly __commands = new Collection<string, CommandBuilder>();

  public addCommand(name: string, options: CommandBuilder) {
    this.__commands.set(name, options);
  }

  public getCommand<Type extends CommandType>(name: string, type: Type) {
    return this.__commands.filter(command => command.type === type).get(name) as CommandBuilder<Type> | undefined;
  }
}
