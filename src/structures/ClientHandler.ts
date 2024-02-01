import type { ClientHandlerPieces } from "../types/handler.js";
import type { MoonlightClient } from "./Client.js";
import { readdir } from "node:fs/promises";
import { PathCreator } from "../structures/PathCreator.js";
import type { EventBuilder } from "./EventBuilder.js";

export class ClientHandler implements ClientHandlerPieces {
  private readonly __path = new PathCreator();

  constructor(private readonly __client: MoonlightClient) {
    this.__path.setDev(false);
    this.__path.setFileExtension(".js");
  }

  async events() {
    const eventsFolder = readdir(this.__path.joinPaths("events"), {
      withFileTypes: true,
    });

    const [result] = await Promise.allSettled([eventsFolder]);

    if (result.status === "rejected")
      throw new Error("Event handler could not be resolved.");

    result.value.filter(file => file.name.endsWith(this.__path.extension)).forEach(async info => {
      const event: EventBuilder = (await import(`../events/${info.name}`)).default;
      console.log(event)

      if (event.once)
        this.__client.once(event.name, event.execute.bind(null, this.__client));
      else
        this.__client.on(event.name, event.execute.bind(null, this.__client));
    });

    console.log(result.value)
  }
}
