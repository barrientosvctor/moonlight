import { ApplicationCommandData, ApplicationCommandType, Collection, Routes } from "discord.js";
import { CommandType } from "../types/command.types.js";
import type {
  CommandManagerPieces,
  CategoryInformation
} from "../types/command.types.js";
import type { CommandBuilder } from "./CommandBuilder.js";
import type { MoonlightClient } from "./Client.js";

type RegistryOptions = {
  sync?: boolean;
  register?: boolean;
  shortcut?: boolean;
}

export class CommandManager implements CommandManagerPieces {
  private readonly __commands = new Collection<string, CommandBuilder>();
  private readonly __aliases = new Collection<string, string>();
  readonly categories = new Collection<string, CategoryInformation>();

  private formatCommandsName(category: CategoryInformation) {
    return category.commands
      .map(command => `\`${command.slice(0, -3)}\``)
      .join(", ");
  }

  private registerViaRoutes(client: MoonlightClient) {
    const guildCommands = this.__commands.filter(c => Boolean(c.guildIds.length) && c.type !== CommandType.Legacy);
    const globalCommands = this.__commands.filter(c => !c.guildIds.length && c.type !== CommandType.Legacy);

    if (globalCommands.size) {
      console.log(`Started refreshing ${globalCommands.size} application (/) commands.`);

      client.rest.put(Routes.applicationCommands(client.user!.id), { body: globalCommands.map(cmd => cmd.buildAPIApplicationCommand()) });

      console.log(`Successfully reloaded ${globalCommands.size} application (/) commands.`);
    }

    if (guildCommands.size) {
      const setOfGuildsIds = [
        ...new Set(guildCommands.map(cmd => cmd.guildIds).flat())
      ];

      if (setOfGuildsIds.length > 1) {
        console.log("Using Routes (faster) method, only first guild id will be considered!");
        console.log("Please use detailed registry for multiple guilds");
      }

      console.log(`Started refreshing ${globalCommands.size} application (/) guild commands.`);

      client.rest.put(Routes.applicationGuildCommands(client.user!.id, guildCommands.first()!.guildIds[0]),
        {
          body: guildCommands.map(cmd => cmd.buildAPIApplicationCommand())
        });

      console.log(`Successfully reloaded ${guildCommands.size} application (/) guild commands.`);
    }
  }

  private async checkFromClient(client: MoonlightClient, command: CommandBuilder) {
    // Guild commands check
    console.log(`Checking if ${command.name} is already registered`);

    if (command.guildIds.length) {
      for (const guildId of command.guildIds) {
        const guild = await client.guilds.fetch(guildId).catch(() => {});

        if (!guild) throw new Error(`Invalid Guild Id in ${command.name} command!`);

        const APICommand = (await guild.commands.fetch()).find(cmd => cmd.name === command.name);
        const providedCommandData: ApplicationCommandData = {
          name: command.name,
          type: command.type as unknown as ApplicationCommandType,
          options: command.options,
          description: command.description ?? "",
          defaultMemberPermissions: command.requiredMemberPermissions
        }

        if (!APICommand) {
          await guild.commands.create(providedCommandData);
          console.log(`Created Command ${command.name} -> ${guild.name}`);
          continue;
        }

        if (!APICommand.equals(providedCommandData, true)) {
          await APICommand.edit(providedCommandData);
          console.log(`Updated Command ${command.name} -> ${guild.name}`);
        }
      }

      console.log(`Processed Command ${command.name}`);
      return;
    }

    // Global commands check
    const APICommand = (await (await client.application?.fetch())!.commands.fetch()).find(cmd => cmd.name === command.name);
    const providedCommandData: ApplicationCommandData = {
      name: command.name,
      type: command.type as unknown as ApplicationCommandType,
      options: command.options,
      description: command.description ?? "",
      defaultMemberPermissions: command.requiredMemberPermissions,
      dmPermission: command.runInDM ?? false
    }

    if (!APICommand) {
      await client.application?.commands.create(providedCommandData);
      console.log(`Created Command ${command.name}`);
    } else {
      if (!APICommand.equals(providedCommandData, true)) {
        await APICommand.edit(providedCommandData);
        console.log(`Updated Command ${command.name}`);
      }
    }

    console.log(`Processed Command ${command.name}`);
    return;
  }

  private registerCommands(client: MoonlightClient) {
    const appCommands = this.__commands.filter(c => Boolean(c.run) && c.type !== CommandType.Legacy).values();

    for (const command of appCommands)
      this.checkFromClient(client, command);
  }

  private async syncCommands(client: MoonlightClient) {
    // Global commands
    console.log(`Fetching Global Commands`);

    const localGlobalCommands = [
      ...this.__commands.filter(c => !c.guildIds.length && Boolean(c.run)).keys()
    ]

    const APIGlobalCommands = await (await client.application?.fetch())!.commands.fetch();
    const APIGlobalCommandsNames = APIGlobalCommands.map((c) => c.name);

    console.log(`Comparing Global Commands data with local data`);

    const toRemove = APIGlobalCommandsNames.filter(c => !localGlobalCommands.includes(c));

    if (toRemove.length)
      console.log(`Removing ${toRemove.length} Global Commands from API`);
    else
      console.log(`No Global Commands found to remove, All synced!`);

    for (const command of toRemove) {
      console.log(`Deleted Global Command: ${command}`);
      APIGlobalCommands.find(cmd => cmd.name === command)?.delete();
    }

    // Guild commands
    const guilds = [...client.guilds.cache.values()];

    for (const guild of guilds) {
      console.log(`Fetching Guild Commands for ${guild.name}`);

      const APIGuildCommands = await guild.commands.fetch();
      const localGuildCommands = [
        ...this.__commands.filter(c => Boolean(c.guildIds.includes(guild.id)) && Boolean(c.run)).keys()
      ];
      const APIGuildCommandsNames = APIGuildCommands.map(c => c.name);

      console.log(`Comparing Guild Commands data with local data`);

      const toRemove = APIGuildCommandsNames.filter(c => !localGuildCommands.includes(c));

      if (toRemove.length)
        console.log(`Removing ${toRemove.length} Guild Commands from API`);
      else
        console.log(`No Commands found to remove from Guild "${guild.name}", All synced!`);

      for (const command of toRemove) {
        console.log(`Deleted Guild Command ${command} -> ${guild.name}`);
        APIGuildCommands.find(cmd => cmd.name === command)?.delete();
      }
    }
  }

  public async initializeSlashCommands(client: MoonlightClient, options: RegistryOptions) {
    if (options.sync && options.register && options.shortcut) {
      console.error("It is NOT recommended to set all registry options to true as it spams the API, please use a single method!");
      process.exit(1);
    }

    console.log(`Syncing Slash Commands...`);

    await Promise.all([
      options.shortcut && this.registerViaRoutes(client),
      options.register && this.registerCommands(client),
      options.sync && this.syncCommands(client)
    ]);

    console.log(`Slash Commands Synced!`);
  }

  public addCommand(name: string, options: CommandBuilder) {
    this.__commands.set(name, options);
  }

  public getCommand<Type extends CommandType>(name: string, type: Type) {
    return this.__commands
      .filter(command => command.type === type)
      .get(name) as CommandBuilder<Type> | undefined;
  }

  public showCommandsList() {
    if (!this.categories.toJSON().length) return "No hay comandos disponibles.";

    return this.categories
      .filter(c => c.name !== "Desarrollador")
      .map(category => {
        const formattedCommandsName = this.formatCommandsName(category);
        return `**${category.name}**\n${formattedCommandsName}`;
      })
      .join("\n\n");
  }

  public addAliasToCommand(alias: string, command: string) {
    this.__aliases.set(alias, command);
  }

  public getCommandByAlias(alias: string) {
    const cmd = this.__aliases.get(alias);
    if (!cmd) return undefined;

    return this.getCommand(cmd, CommandType.Legacy);
  }
}
