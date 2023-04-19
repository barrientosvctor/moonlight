import { ChannelType, GuildChannel } from "discord.js";
import { MoonlightDatabase } from "../../databases";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "muterole",
  description: "Establece el rol para mutear a los miembros del servidor.",
  cooldown: 3,
  usage: "<set / remove> <@rol | ID>",
  example: "set @Muted",
  enabled: true,
  memberPerms: ["ManageRoles"],
  botPerms: ["ManageRoles", "ManageChannels"],
  async run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe una de las siguientes opciones:\n\`set\`: Establece un nuevo rol para mutear.\n\`remove\`: Quita el rol ya establecido.", { mention: msg.author.username, emoji: "noargs" }));
      if (!["set", "remove"].includes(args[1])) return msg.reply(bot.replyMessage("Opción no válida.", { emoji: "error" }));
      const db = new MoonlightDatabase("muterole.json");

      if (args[1] === "set") {
        if (!args[2]) return msg.channel.send(bot.replyMessage("menciona o escribe la ID del rol que se les dará a los miembros muteados a partir de ahora.", { mention: msg.author.username, emoji: "noargs" }));

        const role = getRole(args[2]);
        if (!role) return msg.reply(bot.replyMessage("Este rol no existe en el servidor.", { emoji: "error" }));
        if (role.permissions.toArray().length !== 0) return msg.reply(bot.replyMessage(`El rol no debe tener ningún permiso activado para que cumpla su función.\n\n**- Permisos activados:** ${role.permissions.toArray().map(perm => `${bot.utils.guild.roles.permissions[perm]}`).join(", ")}`, { emoji: "error" }));
        if (db.has(msg.guildId) && role.id === db.get(msg.guildId)) return msg.reply(bot.replyMessage(`El rol **${role.name}** ya estaba establecido como rol para mutear.`, { emoji: "error" }));

        db.set(msg.guildId, role?.id);
        msg.channel.send(bot.replyMessage(`¡El rol **${role.name}** ha sido establecido como rol para mutear en el servidor!`, { emoji: "check" }));
        msg.channel.send(bot.replyMessage("Configurando permisos del rol en cada canal, por favor espere...", { emoji: "waiting" }));

        msg.guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).forEach(async channel => {
          if (channel instanceof GuildChannel) {
            await channel.permissionOverwrites.edit(role.id, { "SendMessages": false, "AddReactions": false, "Connect": false, "Speak": false }).catch(error => {
              console.error(error);
              msg.channel.send(bot.replyMessage(`No se pudo aplicar la configuración de permisos en <#${error.url.split("/")[6]}>. Asegurate que mi rol o el de los bots tenga permitido ver ese canal.`, { emoji: "warning" }));
            });
          } else return;
        });
        msg.guild.channels.cache.filter(c => c.type === ChannelType.GuildText).forEach(async channel => {
          if (channel instanceof GuildChannel) {
            await channel.permissionOverwrites.edit(role.id, { "SendMessages": false, "AddReactions": false }).catch(error => {
              console.error(error);
              msg.channel.send(bot.replyMessage(`No se pudo aplicar la configuración de permisos en <#${error.url.split("/")[6]}>. Asegurate que mi rol o el de los bots tenga permitido ver ese canal.`, { emoji: "warning" }));
            });
          }
        });
        msg.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).forEach(async channel => {
          if (channel instanceof GuildChannel) {
            await channel.permissionOverwrites.edit(role.id, { "Connect": false, "Speak": false }).catch(error => {
              console.error(error);
              msg.channel.send(bot.replyMessage(`No se pudo aplicar la configuración de permisos en <#${error.url.split("/")[6]}>. Asegurate que mi rol o el de los bots tenga permitido ver ese canal.`, { emoji: "warning" }));
            });
          }
        });

        msg.channel.send(bot.replyMessage("¡Configuración completada!", { emoji: "check" }));
      } else if (args[1] === "remove") {
        if (db.has(msg.guildId)) {
          db.delete(msg.guildId);
          return msg.reply(bot.replyMessage(`Se ha removido correctamente el rol establecido anteriormente en el servidor.`, { emoji: "check" }));
        } else return msg.reply(bot.replyMessage(`No se ha configurado un rol para mutear en el servidor. Para eso haz uso del comando \`${prefix}muterole set\`.`, { emoji: "error" }));
      }
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
