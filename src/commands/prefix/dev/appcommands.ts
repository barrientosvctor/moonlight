import {
  APISelectMenuOption,
  ActionRowBuilder,
  ComponentType,
  type Guild,
  Routes,
  StringSelectMenuBuilder,
  type APIApplicationCommand
} from "discord.js";
import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

type Parameters = "--global" | "--guild";

export default new LegacyCommandBuilder({
  name: "appcommands",
  cooldown: 10,
  category: "Desarrollador",
  description: "Haz acciones a los comandos de barra del bot mediante la API.",
  usage: "<get/delete> <--global/--guild> [guildId]",
  example: "get --global",
  ownerOnly: true,
  async run(client, message, args) {
    if (!client.user) return message.reply("No encuentro mi usuario.");

    if (!args[1]) return message.reply("Escribe algún verbo: `get`, `delete`");

    if (!["get", "delete"].includes(args[1]))
      return message.reply("Escribe un verbo válido.");

    if (!args[2])
      return message.reply("Escribe algún parámetro: `--global`, `--guild`");

    if (!["--global", "--guild"].includes(args[2]))
      return message.reply("Escribe un parámetro válido.");

    let targetGuild: Guild | undefined;

    if (args[2] === "--guild") {
      if (args[3]) {
        targetGuild = client.guilds.cache.get(args[3]);

        if (!targetGuild)
          return message.reply("No estoy en este servidor. Prueba otro.");
      } else
        return message.reply(
          "Escribe la id del servidor para ver sus comandos."
        );
    }

    const appType = args[2] as Parameters;

    // TODO: Make modular code to support more than one verb per each parameter.
    // At this moment, the command is able to get and delete global application commands
    // The goal is to allow the capability to get and delete guild application commands
    // using a modular and clean way.
    const routes = {
      "--global": () => Routes.applicationCommands(client.user!.id),
      "--guild": () =>
        Routes.applicationGuildCommands(client.user!.id, targetGuild!.id)
    } as const;

    const targetRoute = routes[appType];

    const data = (await client.rest.get(
      targetRoute()
    )) as APIApplicationCommand[];

    const results = data.map((item, i) => {
      return `**${i + 1}**. ${item.name} (${item.type})`;
    });

    const menuOptions: APISelectMenuOption[] = data.map(item => {
      return {
        label: item.name,
        value: item.id,
        description: item.description || "Sin descripción."
      };
    });

    const selectmenu = new StringSelectMenuBuilder()
      .setCustomId("select_app_cmd")
      .setPlaceholder("Selecciona un comando.")
      .setMaxValues(1)
      .addOptions(menuOptions);

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectmenu
    );

    const selectMessage = await message.reply({
      content: `
# Comandos

${results.join("\n")}
`,
      components: [row]
    });

    const collector = selectMessage.createMessageComponentCollector({
      max: 1,
      filter: m =>
        m.customId === "select_app_cmd" && m.user.id === message.author.id,
      maxUsers: 1,
      componentType: ComponentType.StringSelect,
      time: 60_000
    });

    collector.once("collect", async receive => {
      const commandId = receive.values[0];

      if (args[1] === "get") {
        const cmdData = (await client.rest.get(
          Routes.applicationCommand(client.user!.id, commandId)
        )) as APIApplicationCommand;

        await selectMessage.edit({
          content: `
ID: ${cmdData.id}
Version: ${cmdData.version}
Permisos por defecto: ${cmdData.default_member_permissions}
Tipo: ${cmdData.id}
Nombre: ${cmdData.name}
Nombres locales: ${cmdData.name_localizations}
Descripción: ${cmdData.description || "Sin descripción"}
Descripciones locales: ${cmdData.description_localizations}
Permiso de DM: ${cmdData.dm_permission}
NSFW: ${cmdData.nsfw}
`,
          components: []
        });
        console.log(cmdData);
      } else if (args[1] === "delete") {
        const cmdRest = await fetch(
          `https://discord.com/api/v10${Routes.applicationCommand(client.user!.id, commandId)}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bot ${process.env.DISCORD_TOKEN}`
            }
          }
        );

        if (cmdRest.status === 204)
          await selectMessage.edit({
            content: "Comando eliminado éxitosamente!",
            components: []
          });
        else
          await selectMessage.edit({
            content: `Petición hecha pero devuelta con un código de estado ${cmdRest.status}`,
            components: []
          });
      }
    });

    collector.once("end", (_, reason) => {
      if (reason === "limit") return;
      if (reason === "time") {
        selectMessage
          .edit({
            content: `Cancelado por inactividad.`,
            components: []
          })
          .then(msg =>
            setTimeout(async () => {
              if (msg.deletable) await msg.delete();
            }, 5000)
          );
      }
    });

    return;
  }
});
