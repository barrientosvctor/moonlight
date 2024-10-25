import type {
  Awaitable,
  Collection,
  Message,
  PermissionsString,
} from "discord.js";
import type { MoonlightClient } from "../structures/Client.js";
import type { ContextMenu, LegacyCommandBuilder, SlashCommand } from "../structures/CommandBuilder.js";

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

/**
 * It chooses the respectly command options for every type of command.
 * If the command type is User or Message, it will assign the base command options.
 */


export type AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base> = {
  [K in keyof Base]: Base[K] extends Exclude<Base[K], undefined>
    ? AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base[K]>
    : AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base[K]> | undefined;
};

export type LegacyCommandBuilderPieces = {
  // Base command options
  name: string;
  category: CommandCategory;

  // Base text based command options
  description?: string;
  ownerOnly?: boolean;
  requiredMemberPermissions?: PermissionsString[];
  requiredClientPermissions?: PermissionsString[];

  // Legacy command options
  cooldown?: number;
  aliases?: string[];
  usage?: string;
  example?: string;

  run: (...args: LegacyCommandRunParameters) => Awaitable<unknown>;
};

export type CommandManagerPieces = {
  categories: Collection<string, CategoryInformation>;
  addCommand(name: string, options: LegacyCommandBuilder): void;
  addSlashCommand(name: string, options: SlashCommand): void;
  addContextMenuCommand(name: string, options: ContextMenu): void;
  getCommand(
    name: string
  ): LegacyCommandBuilder | undefined;
  getSlashCommand(
    name: string
  ): SlashCommand | undefined;
  getContextMenuCommand(
    name: string
  ): ContextMenu | undefined;
  showCommandsList(): string;
  addAliasToCommand(alias: string, command: string): void;
  getCommandByAlias(
    alias: string
  ): LegacyCommandBuilder | undefined;
};

export type CategoryInformation = {
  name: string;
  commands: string[];
};
