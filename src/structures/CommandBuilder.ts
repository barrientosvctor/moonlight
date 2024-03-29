import {
  CommandType,
  type CommandOptions,
  type AddUndefinedToPossiblyUndefinedPropertiesOfInterface,
  CommandCategory,
  BaseCommandRunFunction,
  AutoCompleteRunFunction,
  CommandBuilderPieces
} from "../types/command.types.js";
import type {
  ApplicationCommandOptionData,
  PermissionResolvable,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  APIApplicationCommandOption,
  ApplicationCommandType
} from "discord.js";

export class CommandBuilder<Command extends CommandType = CommandType> implements CommandBuilderPieces<Command> {
  private data: CommandOptions<Command>;
  public name: string;
  public type: CommandType;
  public category: CommandCategory
  public guildIds: string[] = [];
  public runInDM?: boolean = false;

  // All properties of every command type
  public description?: string;
  public ownerOnly?: boolean;
  public requiredMemberPermissions?: PermissionResolvable;
  public requiredClientPermissions?: PermissionResolvable;
  public cooldown?: number;
  public aliases?: string[];
  public usage?: string;
  public example?: string;
  public options?: ApplicationCommandOptionData[] = [];

  public run: BaseCommandRunFunction<Command>;
  public autoCompleteRun?: AutoCompleteRunFunction;

  public constructor(data: CommandOptions<Command>) {
    this.data = data;
    this.name = data.name;
    this.type = data.type;
    this.category = data.category;
    this.guildIds = this.data.guildIds ?? []; // Keep it empty for global commands
    this.runInDM = data.dmPermission;

    if (data.type === CommandType.Legacy) {
      this.description = data.description;
      this.ownerOnly = data.ownerOnly ?? false;
      this.requiredMemberPermissions = data.requiredMemberPermissions ?? [];
      this.requiredClientPermissions = data.requiredClientPermissions ?? [];

      this.cooldown = data.cooldown;
      this.aliases = data.aliases ?? [];
      this.usage = data.usage;
      this.example = data.example;
    } else if (data.type === CommandType.ChatInput) {
      this.description = data.description;
      this.ownerOnly = data.ownerOnly;
      this.requiredMemberPermissions = data.requiredMemberPermissions;
      this.requiredClientPermissions = data.requiredClientPermissions;

      this.options = data.options;
      this.autoCompleteRun = data.autoCompleteRun;
    }

    this.run = data.run as BaseCommandRunFunction<Command>;
  }

  public buildAPIApplicationCommand(): RESTPostAPIChatInputApplicationCommandsJSONBody {
    return {
      name: this.data.name,
      description: this.description ?? "",
      default_member_permissions: this.requiredMemberPermissions?.toString(),
      dm_permission: this.runInDM,
      options: this
        .options as AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
          APIApplicationCommandOption[]
        >,
      type: this
        .type as unknown as AddUndefinedToPossiblyUndefinedPropertiesOfInterface<
          ApplicationCommandType.ChatInput | undefined
        >,
    };
  }
}
