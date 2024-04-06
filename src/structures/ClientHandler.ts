import type { MoonlightClient } from "./Client.js";
import { readdir } from "node:fs/promises";
import { PathCreator } from "../structures/PathCreator.js";
import type { EventBuilder } from "./EventBuilder.js";
import { PATH_CREATOR_DEV_MODE } from "./constants/pathCreator.constant.js";
import { CommandBuilder } from "./CommandBuilder.js";
import { type CategoryKeyName, CategoryNames } from "../types/command.types.js";

type ClientHandlerPieces = {
  events(): void;
  commands(): void;
}

export class ClientHandler implements ClientHandlerPieces {
  private readonly __path = new PathCreator(PATH_CREATOR_DEV_MODE);

  constructor(private readonly __client: MoonlightClient) { }

  private convertCategoryName(key: CategoryKeyName) {
    return CategoryNames[key];
  }

  async events() {
    const eventsFolder = readdir(this.__path.joinPaths("events"), {
      withFileTypes: true,
    });

    const [result] = await Promise.allSettled([eventsFolder]);

    if (result.status === "rejected")
      throw new Error(result.reason);

    result.value.filter(file => file.name.endsWith(this.__path.extension)).forEach(async info => {
      const event = (await import(`../events/${info.name}`)).default as EventBuilder;

      if (event.once)
        this.__client.once(event.event, (...args) => event.execute(...args, this.__client));
      else
        this.__client.on(event.event, (...args) => event.execute(...args, this.__client));
    });
  }

  async commands() {
    const commandsFolder = readdir(this.__path.joinPaths("commands"), {
      recursive: true,
      withFileTypes: true
    });

    const [result] = await Promise.allSettled([commandsFolder]);

    if (result.status === "rejected")
      throw new Error(result.reason);

    const commandsInfo = result.value.filter(item => item.name.endsWith(this.__path.extension));

    commandsInfo.forEach(async info => {
      const folderName = info.path.split(/[\\/]+/g).at(-1);
      const commandsPerCategory = Array.from(commandsInfo.filter(data => data.path.split(/[\\/]+/g).at(-1) === folderName), (cmd) => cmd.name);
      if (folderName) {
        const command = (await import(`../commands/${folderName}/${info.name}`)).default as CommandBuilder;
        const convertedFolderName = this.convertCategoryName(folderName as CategoryKeyName);

        this.__client.commandsManager.categories.set(convertedFolderName, { name: convertedFolderName, commands: commandsPerCategory });
        this.__client.commandsManager.addCommand(command.name, command);

        if (command.aliases)
          command.aliases.forEach(alias => this.__client.commandsManager.addAliasToCommand(alias, command.name));
      }
    });
  }
}
