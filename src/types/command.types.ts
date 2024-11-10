import type {
  Awaitable,
  Message,
  PermissionsString
} from "discord.js";
import type { MoonlightClient } from "../structures/Client.js";

export const CategoryNames = {
  information: "Información",
  reaction: "Reacción",
  moderation: "Moderación",
  dev: "Desarrollador",
  utility: "Utilidad",
  entertainment: "Entretenimiento",
  configuration: "Configuración"
} as const;

export type CategoryKeyName = keyof typeof CategoryNames;

/**
 * Union type of the commands categories name. These categories should be written in Spanish because these will be used to show them
 * as command information in Client's responses.
 */
export type CommandCategory = (typeof CategoryNames)[CategoryKeyName];

/**
 * The base command run function for all command types. This receive a CommandType generic and this will be adapted
 * to the required run parameters for every command type.
 */
export type LegacyCommandRunParameters = [
  client: MoonlightClient,
  message: Message<boolean>,
  args: string[]
];

export interface LegacyCommandOptions {
  name: string;
  category: CommandCategory;
  description: string;
  ownerOnly?: boolean;
  requiredMemberPermissions?: PermissionsString[];
  requiredClientPermissions?: PermissionsString[];
  cooldown: number;
  aliases?: string[];
  usage?: string;
  example?: string;
  run: (...args: LegacyCommandRunParameters) => Awaitable<unknown>;
}

export type CategoryInformation = {
  name: string;
  commands: string[];
};
