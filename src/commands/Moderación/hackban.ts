import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "hackban",
    description: "Banea y elimina los mensajes de la última semana de un miembro del servidor.",
    cooldown: 3,
    usage: "<@miembro | ID> [motivo]",
    example: "@Neon#0001 Un motivo",
    enabled: true,
    memberPerms: ["BanMembers"],
    botPerms: ["BanMembers"],
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("menciona o escriba la ID del miembro que va a banear del servidor.", { mention: msg.author.username, emoji: "noargs" }));

            const member = getMember(args[1]);
            if (!member) return msg.reply(bot.replyMessage("Este usuario no está en el servidor. Prueba con otro.", { emoji: "error" }));

            let motivo = args.slice(2).join(" ");
            if (!motivo) motivo = "No se dio motivo.";
            if (motivo.length >= 511) motivo = `${motivo.slice(0, 508)}...`;

            if (member === msg.member) return msg.reply(bot.replyMessage("No te puedes banear a ti mismo, prueba con otro.", { emoji: "error" }));
            if (member === msg.guild?.members.me) return msg.reply(bot.replyMessage("¿Por qué yo?", { emoji: "error" }));
            if (member.roles.highest.position >= msg.member!.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedes banear a este miembro debido a que cuenta con un rol igual o superior al tuyo.", { emoji: "error" }));
            if (!member.manageable) return msg.reply(bot.replyMessage(`No puedo banear a ${member.user?.tag} ya que tiene un rol igual o superior al mío.`, { emoji: "error" }));
            if (!member.bannable) return msg.reply(bot.replyMessage(`No se puede banear a ${member.user?.tag}`, { emoji: "error" }));

            await member.ban({ reason: motivo, deleteMessageSeconds: 60 * 60 * 24 * 7 }).then(async () => {
                msg.reply(bot.replyMessage(`**${member.user?.tag}** (\`${member.user?.id}\`) ha sido baneado del servidor.\n> Motivo: ${motivo}`, { emoji: "check" }));
                await member.user.send(`> ¡Has sido baneado de **${msg.guild?.name}** por **${msg.author.tag}**!\n**Motivo:** ${motivo}`);
            }).catch(err => {
                console.error(err);
                msg.channel.send(bot.replyMessage("No se pudo enviar un aviso al mensaje privado de este usuario, tal vez tenga los mensajes privados desactivados.", { emoji: "warning" }));
            });
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
