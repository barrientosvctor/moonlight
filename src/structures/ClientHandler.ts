import type { MoonlightClient } from "./Client.js";
import { readdir } from "node:fs/promises";
import { PathCreator } from "../structures/PathCreator.js";
import type { EventBuilder } from "./EventBuilder.js";
import { PATH_CREATOR_DEV_MODE } from "./constants/pathCreator.constant.js";
import { ContextMenu, SlashCommand } from "./CommandBuilder.js";

export class ClientHandler {
  private readonly __path = new PathCreator(PATH_CREATOR_DEV_MODE);

  constructor(private readonly __client: MoonlightClient) {}

  async events() {
    const eventsFolder = readdir(this.__path.joinPaths("events"), {
      withFileTypes: true
    });

    const [result] = await Promise.allSettled([eventsFolder]);

    if (result.status === "rejected") throw new Error(result.reason);

    result.value
      .filter(file => file.name.endsWith(this.__path.extension))
      .forEach(async info => {
        const event = (await import(`../events/${info.name}`))
          .default as EventBuilder;

        if (event.once)
          this.__client.once(event.event, (...args) =>
            event.execute(...args, this.__client)
          );
        else
          this.__client.on(event.event, (...args) =>
            event.execute(...args, this.__client)
          );
      });
  }

  public async contextMenus() {
    const contextFolder = readdir(this.__path.joinPaths("commands", "context"));

    const [result] = await Promise.allSettled([contextFolder]);

    if (result.status === "rejected") throw new Error(result.reason);

    result.value
      .filter(f => f.endsWith(this.__path.extension))
      .forEach(async filename => {
        const context = (await import(`../commands/context/${filename}`))
          .default as ContextMenu;

        this.__client.commandsManager.addContextMenuCommand(
          context.data.name,
          context
        );
      });
  }

  public async slashCommands() {
    const slashCommandsFolder = readdir(
      this.__path.joinPaths("commands", "slash"),
      {
        withFileTypes: true
      }
    );

    const [result] = await Promise.allSettled([slashCommandsFolder]);

    if (result.status === "rejected") throw new Error(result.reason);

    result.value.forEach(async info => {
      const command = (await import(`../commands/slash/${info.name}`))
        .default as SlashCommand;

      this.__client.commandsManager.addSlashCommand(command.data.name, command);
    });
  }
}
