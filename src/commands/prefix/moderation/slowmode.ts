import { ChannelType } from "discord.js";
import { CommandBuilder } from "../../../structures/CommandBuilder.js";
import { CommandType } from "../../../types/command.types.js";
import {
  HumanizeDuration,
  HumanizeDurationLanguage
} from "humanize-duration-ts";
import { getChannel } from "../../../util/functions.js";
import { toMs } from "ms-typescript";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "slowmode",
  cooldown: 5,
  category: "Moderación",
  description: "Añade un modo lento al chat.",
  usage: "<tiempo / off> [#canal | ID]",
  example: "20s #general",
  requiredClientPermissions: ["ManageChannels"],
  requiredMemberPermissions: ["ManageChannels"],
  async run(client, message, args) {
    const humanizeService = new HumanizeDuration(
      new HumanizeDurationLanguage()
    );

    humanizeService.setOptions({
      language: "es"
    });

    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("Escribe la duración del modo lento.", {
          emoji: "noargs",
          mention: message.author.username
        })
      );

    const channel = getChannel(args[2], message) ?? message.channel;

    if (channel.type !== ChannelType.GuildText)
      return message.reply(
        client.beautifyMessage(
          "Solo puedo hacer esta acción con canales de texto.",
          { emoji: "error" }
        )
      );

    const time = args[1];

    if (
      time !== `${parseInt(time.slice(0))}s` &&
      time !== `${parseInt(time.slice(0))}m` &&
      time !== `${parseInt(time.slice(0))}h` &&
      time !== `${parseInt(time.slice(0))}d` &&
      time !== `${parseInt(time.slice(0))}w` &&
      time !== `${parseInt(time.slice(0))}y`
    )
      return message.reply(
        client.beautifyMessage(
          "Escribe una duración válida. (10s / 5m / 1h / 2w / 1y)",
          { emoji: "error" }
        )
      );

    const timeToMS = toMs(time),
      timeToSeconds = Math.ceil(timeToMS / 1000);

    if (timeToSeconds < 0)
      return message.reply(
        client.beautifyMessage("No puedes escribir tiempos negativos.", {
          emoji: "error"
        })
      );

    if (timeToSeconds === 0 || time === "off") {
      if (channel.rateLimitPerUser < 1)
        return message.reply(
          client.beautifyMessage(
            `El canal ${channel} no tiene un modo lento establecido.`,
            { emoji: "error" }
          )
        );

      try {
        await channel.setRateLimitPerUser(0);
      } catch (error) {
        console.error(error);
        return message.channel.send(
          client.beautifyMessage(
            "Ocurrió un error al intentar quitar el cooldown en el canal.",
            { emoji: "warning" }
          )
        );
      }

      return channel.send(
        client.beautifyMessage(
          "El modo lento en este canal ha sido desactivado.",
          { emoji: "check" }
        )
      );
    } else {
      if (timeToSeconds > 21600)
        return message.reply(
          client.beautifyMessage(
            "El tiempo máximo de cooldown es de 6 horas.",
            { emoji: "error" }
          )
        );

      try {
        await channel.setRateLimitPerUser(timeToSeconds);
      } catch (error) {
        console.error(error);
        return message.channel.send(
          client.beautifyMessage(
            "Ocurrió un error al intentar cambiar el cooldown del canal.",
            { emoji: "warning" }
          )
        );
      }

      return channel.send(
        client.beautifyMessage(
          `El canal ha sido establecido con un cooldown de **${humanizeService.humanize(timeToMS)}**`,
          { emoji: "check" }
        )
      );
    }
  }
});
