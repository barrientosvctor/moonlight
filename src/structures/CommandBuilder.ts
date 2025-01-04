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
  public ownerOnly?: boolean;
  public clientPermissions?: PermissionsString[];
  public enabled?: boolean;
  public run: (
    ...args: [interaction: ChatInputCommandInteraction, client: MoonlightClient]
  ) => Awaitable<unknown>;

  constructor(options: SlashCommandOptions) {
    this.data = options.data;
    this.ownerOnly = options.ownerOnly ?? false;
    this.clientPermissions = options.clientPermissions;
    this.enabled = options.enabled ?? true;
    this.run = options.run;

    if (!this.enabled) this.ownerOnly = true;
  }
}

type ContextMenuOptions = {
  data: ContextMenuCommandBuilder;
  run: (
    ...args: [
      interaction: ContextMenuCommandInteraction,
      client: MoonlightClient
    ]
  ) => Awaitable<unknown>;
};

export class ContextMenu implements ContextMenuOptions {
  public data: ContextMenuCommandBuilder;
  public run: (
    ...args: [
      interaction: ContextMenuCommandInteraction,
      client: MoonlightClient
    ]
  ) => Awaitable<unknown>;

  constructor(options: ContextMenuOptions) {
    this.data = options.data;
    this.run = options.run;
  }
}
