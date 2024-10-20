import {
  CommandCategory,
  LegacyCommandBuilderPieces as LegacyCommandBuilderPieces,
  LegacyCommandRunParameters,
  LegacyCommandOptions
} from "../types/command.types.js";
import type {
  PermissionsString,
  Awaitable
} from "discord.js";

export class LegacyCommandBuilder implements LegacyCommandBuilderPieces {
  public name: string;
  public category: CommandCategory;
  public description?: string;
  public ownerOnly?: boolean;
  public requiredMemberPermissions?: PermissionsString[];
  public requiredClientPermissions?: PermissionsString[];
  public cooldown?: number;
  public aliases?: string[];
  public usage?: string;
  public example?: string;
  public run: (...args: LegacyCommandRunParameters) => Awaitable<unknown>;

  constructor(data: LegacyCommandOptions) {
    this.name = data.name;
    this.category = data.category;
    this.description = data.description;
    this.ownerOnly = data.ownerOnly ?? false;
    this.requiredMemberPermissions = data.requiredMemberPermissions;
    this.requiredClientPermissions = data.requiredClientPermissions;
    this.cooldown = data.cooldown;
    this.aliases = data.aliases;
    this.usage = data.usage;
    this.example = data.example;
    this.run = data.run;
  }
}
