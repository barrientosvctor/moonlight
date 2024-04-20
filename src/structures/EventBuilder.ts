import type { Awaitable, ClientEvents } from "discord.js";
import type { MoonlightClient } from "./Client.js";

export class EventBuilder<Event extends keyof ClientEvents = keyof ClientEvents>
  implements EventBuilderParameters<Event>
{
  event: EventBuilderParameters<Event>["event"];
  once?: EventBuilderParameters<Event>["once"];
  execute: EventBuilderParameters<Event>["execute"];

  constructor(protected readonly __params: EventBuilderParameters<Event>) {
    this.event = __params.event;
    this.once = __params.once ?? false;
    this.execute = __params.execute;
  }
}

type EventBuilderParameters<T> = {
  event: T extends keyof ClientEvents ? T : keyof ClientEvents;
  once?: boolean;
  execute: (...args: EventArgs<T>) => Awaitable<void>;
};

type EventArgs<T> = T extends keyof ClientEvents
  ? [...args: ClientEvents[T], client: MoonlightClient]
  : unknown[];
