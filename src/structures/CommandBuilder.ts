import {
  CommandCategory,
  LegacyCommandBuilderPieces,
  LegacyCommandRunParameters,
  LegacyCommandOptions
} from "../types/command.types.js";
import type {
  PermissionsString,
  Awaitable,
  SlashCommandBuilder,
  ChatInputCommandInteraction
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

type SlashCommandOptions = {
  data: SlashCommandBuilder;
  ownerOnly?: boolean;
  run: (...args: [interaction: ChatInputCommandInteraction]) => Awaitable<unknown>;
}

export class SlashCommand {
  public data: SlashCommandBuilder;
  public ownerOnly?: boolean;
  public run: (...args: [interaction: ChatInputCommandInteraction]) => Awaitable<unknown>;

  constructor(options: SlashCommandOptions) {
    this.data = options.data;
    this.ownerOnly = options.ownerOnly ?? false;
    this.run = options.run;
  }
}
