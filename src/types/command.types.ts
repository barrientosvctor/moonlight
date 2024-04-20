import type {
  ApplicationCommandOptionData,
  AutocompleteInteraction,
  Awaitable,
  ChatInputCommandInteraction,
  Collection,
  Message,
  MessageContextMenuCommandInteraction,
  PermissionsString,
  UserContextMenuCommandInteraction
} from "discord.js";
import type { MoonlightClient } from "../structures/Client.js";
import type { CommandBuilder } from "../structures/CommandBuilder.js";

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
 *
 * ChatInput = [Slash Commands](https://discord.com/developers/docs/interactions/application-commands#slash-commands)
 * User = [User Commands](https://discord.com/developers/docs/interactions/application-commands#user-commands)
 * Message = [Message commands](https://discord.com/developers/docs/interactions/application-commands#message-commands)
 * Legacy = Prefix commands (internal id)
 */
export const enum CommandType {
  ChatInput = 1,
  User = 2,
  Message = 3,
  Legacy = 4,
}

export const CategoryNames = {
  information: "Información",
  reaction: "Reacción",
  moderation: "Moderación",
  dev: "Desarrollador"
} as const;

export type CategoryKeyName = keyof typeof CategoryNames;

/**
 * Union type of the commands categories name. These categories should be written in Spanish because these will be used to show them
 * as command information in Client's responses.
 */
export type CommandCategory = typeof CategoryNames[CategoryKeyName];

/**
 * The base command run function for all command types. This receive a CommandType generic and this will be adapted
 * to the required run parameters for every command type.
 */
export type BaseCommandRunFunction<Type extends CommandType> = (...args: RunType[Type]) => Awaitable<unknown>;

interface BaseCommandOptions<Type extends CommandType> {
  type: Type;
  name: string;
  category: CommandCategory;
  run: BaseCommandRunFunction<Type>;
}

interface BaseTextBasedCommandOptions<Type extends CommandType> extends BaseCommandOptions<Type> {
  description: string;
  ownerOnly?: boolean;
  requiredMemberPermissions?: PermissionsString[];
  requiredClientPermissions?: PermissionsString[];
}

interface LegacyCommandOptions extends BaseTextBasedCommandOptions<CommandType.Legacy> {
  cooldown: number;
  aliases?: string[];
  usage?: string;
  example?: string;
}

export type AutoCompleteRunFunction = (interaction: AutocompleteInteraction) => Awaitable<unknown>;

interface ChatInputCommandOptions extends BaseTextBasedCommandOptions<CommandType.ChatInput> {
  options?: ApplicationCommandOptionData[];
  autoCompleteRun?: AutoCompleteRunFunction;
}

interface GlobalCommand {
  dmPermission?: false;
  guildIds?: never;
}

interface GuildCommand {
  dmPermission?: never;
  guildIds?: NonEmptyArray;
}

/**
 * It chooses the respectly command options for every type of command.
 * If the command type is User or Message, it will assign the base command options.
 */
export type CommandOptions<Command extends CommandType> = Command extends CommandType.ChatInput
  ? ChatInputCommandOptions & BaseCommand
  : Command extends CommandType.Legacy
  ? LegacyCommandOptions & BaseCommand
  : BaseCommandOptions<Command> & BaseCommand;

type BaseCommand = GuildCommand | GlobalCommand;

type NonEmptyArray<Type extends `${number}` = `${number}`> = [Type, ...Type[]];

interface RunType {
  [CommandType.ChatInput]: [interaction: ChatInputCommandInteraction];
  [CommandType.Message]: [interaction: MessageContextMenuCommandInteraction];
  [CommandType.User]: [interaction: UserContextMenuCommandInteraction];
  [CommandType.Legacy]: [client: MoonlightClient, message: Message<boolean>, args: string[]];
}

export type AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base> = {
  [K in keyof Base]: Base[K] extends Exclude<Base[K], undefined>
  ? AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base[K]>
  : AddUndefinedToPossiblyUndefinedPropertiesOfInterface<Base[K]> | undefined;
}

export type CommandBuilderPieces<Type extends CommandType = CommandType> = {
  // Base command options
  name: string;
  type: CommandType;
  category: CommandCategory;
  guildIds: string[];
  runInDM?: boolean;

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

  // Chat Input command options
  options?: ApplicationCommandOptionData[];
  autoCompleteRun?: AutoCompleteRunFunction;

  run: BaseCommandRunFunction<Type>;
}

export type CommandManagerPieces = {
  categories: Collection<string, CategoryInformation>;
  addCommand(name: string, options: CommandBuilder): void;
  getCommand<Type extends CommandType>(name: string, type: Type): CommandBuilder<Type> | undefined;
  showCommandsList(): string;
  addAliasToCommand(alias: string, command: string): void;
  getCommandByAlias(alias: string): CommandBuilder<CommandType.Legacy> | undefined;
}

export type CategoryInformation = {
  name: string;
  commands: string[];
}
