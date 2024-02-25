import type { ClientHandlerPieces } from "../types/handler.types.js";
import type { MoonlightClient } from "./Client.js";
import { readdir } from "node:fs/promises";
import { PathCreator } from "../structures/PathCreator.js";
import type { EventBuilder } from "./EventBuilder.js";
import { PATH_CREATOR_DEV_MODE } from "./constants/pathCreator.constant.js";
import { CommandBuilder } from "./CommandBuilder.js";

export class ClientHandler implements ClientHandlerPieces {
  private readonly __path = new PathCreator(PATH_CREATOR_DEV_MODE);

  constructor(private readonly __client: MoonlightClient) { }

  async events() {
    const eventsFolder = readdir(this.__path.joinPaths("events"), {
      withFileTypes: true,
    });

    const [result] = await Promise.allSettled([eventsFolder]);

    if (result.status === "rejected")
      throw new Error("Event handler could not be resolved.");

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
      throw new Error("Command handler could not be resolved.");

    result.value.filter(item => item.name.endsWith(this.__path.extension)).forEach(async info => {
      const folderName = info.path.split(/[\\/]+/g).at(-1);
      const command = (await import(`../commands/${folderName}/${info.name}`)).default as CommandBuilder;

      this.__client.commandsManager.addCommand(command.name, command);
    });
  }
}
