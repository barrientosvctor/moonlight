import {
  CommandCategory,
  LegacyCommandRunParameters,
  LegacyCommandOptions
} from "../types/command.types.js";
import type {
  PermissionsString,
  Awaitable,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder
} from "discord.js";
import type { MoonlightClient } from "./Client.js";

export class LegacyCommandBuilder {
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
  data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  testGuildOnly?: boolean;
  ownerOnly?: boolean;
  run: (
    ...args: [interaction: ChatInputCommandInteraction, client: MoonlightClient]
  ) => Awaitable<unknown>;
};

export class SlashCommand implements SlashCommandOptions {
  public data: SlashCommandBuilder | SlashCommandSubcommandsOnlyBuilder;
  public testGuildOnly?: boolean;
  public ownerOnly?: boolean;
  public run: (
    ...args: [interaction: ChatInputCommandInteraction, client: MoonlightClient]
  ) => Awaitable<unknown>;

  constructor(options: SlashCommandOptions) {
    this.data = options.data;
    this.testGuildOnly = options.testGuildOnly ?? false;
    this.ownerOnly = options.ownerOnly ?? false;
    this.run = options.run;
  }
}

type ContextMenuOptions = {
  data: ContextMenuCommandBuilder;
  testGuildOnly?: boolean;
  run: (
    ...args: [
      interaction: ContextMenuCommandInteraction,
      client: MoonlightClient
    ]
  ) => Awaitable<unknown>;
};

export class ContextMenu implements ContextMenuOptions {
  public data: ContextMenuCommandBuilder;
  public testGuildOnly?: boolean;
  public run: (
    ...args: [
      interaction: ContextMenuCommandInteraction,
      client: MoonlightClient
    ]
  ) => Awaitable<unknown>;

  constructor(options: ContextMenuOptions) {
    this.data = options.data;
    this.testGuildOnly = options.testGuildOnly ?? false;
    this.run = options.run;
  }
}
