import type { ClientHandlerPieces } from "../types/handler.js";
import type { MoonlightClient } from "./Client.js";
import { readdir } from "node:fs/promises";
import { PathCreator } from "../structures/PathCreator.js";
import type { EventBuilder } from "./EventBuilder.js";

export class ClientHandler implements ClientHandlerPieces {
  private readonly __path = new PathCreator();

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
      console.log(event)

      if (event.once)
        this.__client.once(event.event, (...args) => event.execute(...args, this.__client));
      else
        this.__client.on(event.event, (...args) => event.execute(...args, this.__client));
    });

    console.log(result.value)
  }
}
