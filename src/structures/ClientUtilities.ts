import type { PermissionsString } from "discord.js";
import type { ClientUtilitiesPieces } from "../types/client.types.js";
import { CommandType } from "../types/command.types.js";
import { type MoonlightClient } from "./Client.js";

export class ClientUtilities implements ClientUtilitiesPieces {
  public constructor(private readonly __client: MoonlightClient) {}

  /**
   * It takes the permissions array and convert it to its Spanish version on a new array.
   *
   * @param {string} perms
   */
  public convertPermissionsToSpanish(perms: PermissionsString[]) {
    return perms.map(perm =>
      this.__client.wrapper.get("guild.roles.permissions", perm)
    );
  }

  /**
   * This function is a short and modular way to search commands in the collection.
   * You should use it when you need to get commands.
   */
  public receiveCommand(argument: string) {
    return (
      this.__client.commandsManager.getCommand(argument, CommandType.Legacy) ||
      this.__client.commandsManager.getCommandByAlias(argument)
    );
  }

  /**
   * This function is my own implementation of `Set.prototype.difference()` (not implemented yet) using arrays.
   *
   * Compares the differences between arr1 and arr2.
   * This function will return a new array with those values that stay in arr1 and not in arr2.
   */
  public diff<ArrayType extends unknown[]>(
    arr1: ArrayType,
    arr2: ArrayType
  ): ArrayType {
    return arr1.filter(item => !arr2.includes(item)) as ArrayType;
  }
}
