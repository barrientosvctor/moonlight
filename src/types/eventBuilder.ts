import { ClientEvents } from "discord.js";
import { MoonlightClient } from "../structures/Client.js";

export type EventBuilderParameters = {
  name: keyof ClientEvents;
  once?: boolean;
  execute: (client: MoonlightClient, ...args: any[]) => void;
}
