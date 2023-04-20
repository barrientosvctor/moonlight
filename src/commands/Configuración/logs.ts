import { TextChannel } from "discord.js";
import { MoonlightDatabase } from "../../databases";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "logs",
  description: "Activa o desactiva los registros de auditoría de Moonlight.",
  cooldown: 3,
  usage: "<set / delete> <#canal | ID>",
  example: "set @Logs",
  enabled: false,
  memberPerms: ["ManageGuild"],
  async run(bot, msg, args, prefix, getUser, getMember, getChannel) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe una de las siguientes opciones:\n\`set\`: Establece el canal donde se enviarán los logs.\n\`delete\`: Elimina los logs del servidor.", { mention: msg.author.username, emoji: "noargs" }));
      if (!["set", "delete"].includes(args[1])) return msg.reply(bot.replyMessage("Opción no válida.", { emoji: "error" }));
      const db = new MoonlightDatabase("logs.json");

      if (args[1] === "set") {
        if (!args[2]) return msg.channel.send(bot.replyMessage("menciona o escribe la ID del canal en donde se registrarán los logs.", { mention: msg.author.username, emoji: "noargs" }))

        const channel = getChannel(args[2]);
        if (!channel) return msg.reply(bot.replyMessage("Este canal no existe en el servidor, prueba con otro.", { emoji: "error" }));
        if (channel instanceof TextChannel) {
          if (!channel.permissionsFor(msg.guild.members.me).has(["ViewChannel", "SendMessages", "EmbedLinks"])) return msg.reply(bot.replyMessage("Me faltan alguno de los siguientes permisos para establecer los registros en ese canal:\n**-** **Ver canal**, **Enviar mensajes**, **Enviar Links**", { emoji: "error" }));
          if (channel.id === db.get(msg.guildId)) return msg.reply(bot.replyMessage("No se puede establecer los registros en este canal porque ya están establecidos ahí.", { emoji: "error" }));

          db.set(msg.guildId, channel.id);
          channel.send(bot.replyMessage(`A partir de ahora enviaré los registros en este canal.\nSi deseas eliminar los registros en este canal puedes hacer uso del comando \`${prefix}logs delete\``, { emoji: "check" }));
          return msg.reply(bot.replyMessage(`Los registros han sido establecidos éxitosamente en el canal ${channel}.`, { emoji: "tada" }));
        } else return msg.reply(bot.replyMessage("No puedo hacer esta acción con canales que no sean de texto.", { emoji: "error" }));
      } else {
        if (db.has(msg.guildId)) {
          db.delete(msg.guildId);
          return msg.reply(bot.replyMessage("Los registros fueron eliminados del servidor.", { emoji: "check" }));
        } else return msg.reply(bot.replyMessage(`No se han establecido registros en el servidor. Para establecer uno haz uso del comando \`${prefix}logs set\``, { emoji: "error" }));
      }
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
