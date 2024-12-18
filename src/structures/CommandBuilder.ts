import type {
  PermissionsString,
  Awaitable,
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ContextMenuCommandBuilder,
  ContextMenuCommandInteraction,
  SlashCommandSubcommandsOnlyBuilder,
  SlashCommandOptionsOnlyBuilder
} from "discord.js";
import type { MoonlightClient } from "./Client.js";

type SlashCommandOptions = {
  data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  testGuildOnly?: boolean;
  ownerOnly?: boolean;
  clientPermissions?: PermissionsString[];
  enabled?: boolean;
  run: (
    ...args: [interaction: ChatInputCommandInteraction, client: MoonlightClient]
  ) => Awaitable<unknown>;
};

export class SlashCommand implements SlashCommandOptions {
  public data:
    | SlashCommandBuilder
    | SlashCommandSubcommandsOnlyBuilder
    | SlashCommandOptionsOnlyBuilder;
  public testGuildOnly?: boolean;
  public ownerOnly?: boolean;
  public clientPermissions?: PermissionsString[];
  public enabled?: boolean;
  public run: (
    ...args: [interaction: ChatInputCommandInteraction, client: MoonlightClient]
  ) => Awaitable<unknown>;

  constructor(options: SlashCommandOptions) {
    this.data = options.data;
    this.testGuildOnly = options.testGuildOnly ?? false;
    this.ownerOnly = options.ownerOnly ?? false;
    this.clientPermissions = options.clientPermissions;
    this.enabled = options.enabled ?? true;
    this.run = options.run;

    if (!this.enabled) this.testGuildOnly = true;
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
