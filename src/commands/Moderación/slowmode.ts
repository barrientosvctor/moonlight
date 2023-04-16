import { TextChannel } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { toMs } from "ms-typescript";
import humanize from "humanize-duration";

export default new CommandBuilder({
  name: "slowmode",
  description: "Añade un modo lento al chat.",
  cooldown: 3,
  usage: "[#canal | ID] <tiempo / off>",
  example: "20s",
  enabled: true,
  memberPerms: ["ManageChannels"],
  botPerms: ["ManageChannels"],
  async run(bot, msg, args, prefix, getUser, getMember, getChannel) {
    try {
      const channel = getChannel(args[1]) || msg.channel
      const time = getChannel(args[1]) ? args[2] : args[1];

      if (channel instanceof TextChannel) {
        if (time === "0" || time === "off") {
          if (channel.rateLimitPerUser < 1) return msg.reply(bot.replyMessage(`El canal ${channel} no tiene un modo lento establecido.`, { emoji: "error" }));

          await channel.setRateLimitPerUser(0).then(() => {
            channel.send(bot.replyMessage("El modo lento en el canal ha sido desactivado.", { emoji: "check" }));
          }).catch(error => {
            console.error(error);
            msg.channel.send(bot.replyMessage("Ocurrió un error al intentar quitar el cooldown en el canal.", { emoji: "warning" }))
          });
        } else {
          if (!time) return msg.channel.send(bot.replyMessage("especifica el tiempo de cooldown para el chat.", { mention: msg.author.username, emoji: "noargs" }));
          if (time !== (`${parseInt(time.slice(0))}s`) && time !== (`${parseInt(time.slice(0))}m`) && time !== (`${parseInt(time.slice(0))}h`) && time !== (`${parseInt(time.slice(0))}d`) && time !== (`${parseInt(time.slice(0))}w`) && time !== (`${parseInt(time.slice(0))}y`)) return msg.reply(bot.replyMessage("Escribe una duración válida. (10s/5m/1h/2w/1y)", { emoji: "error" }));
          if (Math.ceil(toMs(time) / 1000) > 21600) return msg.reply(bot.replyMessage("El tiempo máximo de cooldown es de 6 horas.", { emoji: "error" }));

          await channel.setRateLimitPerUser(Math.ceil(toMs(time) / 1000)).then(() => {
            return channel.send(bot.replyMessage(`El canal ha sido establecido con un cooldown de **${humanize(toMs(time))}**`, { emoji: "check" }));
          }).catch(error => {
            console.error(error);
            msg.channel.send(bot.replyMessage("Ocurrió un error al intentar cambiar el cooldown del canal.", { emoji: "warning" }));
          });
        }
      } else return msg.reply(bot.replyMessage("Solo puedo hacer esta acción con canales de texto.", { emoji: "error" }));
    } catch (err) {
      bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
