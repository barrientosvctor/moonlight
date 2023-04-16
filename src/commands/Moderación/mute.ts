import { MoonlightDatabase } from "../../databases";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import humanize from "humanize-duration";
import { toMs } from "ms-typescript";

export default new CommandBuilder({
  name: "mute",
  description: "Mutea temporalmente a un miembro del servidor.",
  cooldown: 3,
  usage: "<@miembro | ID> <tiempo> [motivo]",
  example: "@Neon#0001 1h Flood",
  enabled: true,
  memberPerms: ["ManageRoles"],
  botPerms: ["ManageRoles"],
  async run(bot, msg, args, prefix, getUser, getMember) {
    try {
      const db = new MoonlightDatabase("muterole.json");
      if (db.has(msg.guildId)) {
        if (!args[1]) return msg.channel.send(bot.replyMessage("menciona o escribe la ID del miembro que vas a mutear.", { mention: msg.author.username, emoji: "noargs" }));

        const member = getMember(args[1]);
        if (!member) return msg.reply(bot.replyMessage("Parece que este usuario no pertenece al servidor.", { emoji: "error" }));
        if (!args[2] || args[2] !== (`${parseInt(args[2].slice(0))}s`) && args[2] !== (`${parseInt(args[2].slice(0))}m`) && args[2] !== (`${parseInt(args[2].slice(0))}h`) && args[2] !== (`${parseInt(args[2].slice(0))}d`) && args[2] !== (`${parseInt(args[2].slice(0))}w`) && args[2] !== (`${parseInt(args[2].slice(0))}y`)) return msg.reply(bot.replyMessage("Escribe una duración válida. (10s/5m/1h/2w/1y)", { emoji: "error" }));

        let motivo = args.slice(3).join(" ");
        if (!motivo) motivo = "No se dio motivo.";
        if (motivo.length >= 511) motivo = `${motivo.slice(0, 508)}...`;

        if (member === msg.member) return msg.reply(bot.replyMessage("No te puedes mutear a ti mismo.", { emoji: "error" }));
        if (member === msg.guild.members.me) return msg.reply(bot.replyMessage("No me puedes mutear del servidor con mis comandos.", { emoji: "error" }));

        if (member.roles.highest.position >= msg.member.roles.highest.position) return msg.reply(bot.replyMessage(`No puedo mutear a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al tuyo.`, { emoji: "error" }));
        if (!member.manageable) return msg.reply(bot.replyMessage(`No logré mutear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`, { emoji: "error" }));
        if (member.roles.cache.has(db.get(msg.guildId) as string)) return msg.reply(bot.replyMessage(`${member.user.tag} ya estaba muteado.`, { emoji: "error" }));

        await member.roles.add(db.get(msg.guildId) as string).then(async () => {
          const duration = humanize(toMs(args[2]));
          msg.reply(bot.replyMessage(`**${member.user.tag}** (\`${member.user.id}\`) ha sido muteado del servidor.\nMotivo: ${motivo}\nDuración: ${duration}`, { emoji: "check" }));

          try {
            await member.user.send(`> ¡Has sido muteado temporalmente de **${msg.guild.name}** por **${msg.author.tag}**!\n**Duración:** ${duration}\n**Motivo:** ${motivo}`);
          } catch (error) {
            msg.channel.send(bot.replyMessage("No fue posible enviarle un mensaje privado avisándole sobre su mute, tal vez se deba a que tiene cerrado los mensajes privados.", { emoji: "warning" }));
          }

          setTimeout(async () => {
            await member.roles.remove(db.get(msg.guildId) as string);
            try {
              await member.user.send(bot.replyMessage(`¡Tu muteo temporal de **${msg.guild.name}** ha terminado!`, { emoji: "tada" }));
            } catch (error) {
              await member.user.send(bot.replyMessage("Tu mute temporal ha terminado pero no fui capaz de quitarte el rol debido a una falta de permisos en el servidor, contacta a los staffs sobre esto.", { emoji: "warning" }));
            }
          }, toMs(args[2]));
        }).catch(err => {
          console.error(err);
          msg.channel.send(bot.replyMessage("Ocurrió un error al intentar mutear a este usuario.", { emoji: "warning" }));
        });
      } else return msg.reply(bot.replyMessage(`Todavía no puedes mutear a nadie en este momento debido a que no has configurado un rol para mutear en el servidor. Para ello haz uso del comando \`${prefix}muterole set\`.`, { emoji: "error" }));
    } catch (err) {
      bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
    }
  }
});
