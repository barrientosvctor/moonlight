import type { ClientUtilitiesPieces } from "../types/client.types.js";
import { CommandType } from "../types/command.types.js";
import { type MoonlightClient } from "./Client.js";

export class ClientUtilities implements ClientUtilitiesPieces {
  public constructor(private readonly __client: MoonlightClient) {}

  /**
   * This is used with `PermissionResolvable.toString()`
   * It takes the permissions string and convert it to its Spanish version on a new array.
   *
   * @param {string} perms
   */
  public convertPermissionStringToArray(perms: string) {
    const permsArray = perms.split(/[, ]/g);
    return permsArray.map(perm => this.__client.wrapper.get("guild.roles.permissions", perm));
  }


  /**
  * This function is a short and modular way to search commands in the collection.
  * You should use it when you need to get commands.
  */
  public receiveCommand(argument: string) {
    return this.__client.commandsManager.getCommand(argument, CommandType.Legacy) || this.__client.commandsManager.getCommandByAlias(argument);
  }
}
