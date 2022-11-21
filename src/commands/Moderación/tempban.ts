import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { toMs } from "ms-typescript";
import humanize from "humanize-duration";

export default new CommandBuilder({
    name: "tempban",
    description: "Banea temporalmente a un usuario de su servidor.",
    cooldown: 3,
    usage: "<@miembro | ID> <tiempo> [motivo]",
    example: "@Neon#0001 1h Un motivo",
    enabled: true,
    memberPerms: ["BanMembers"],
    botPerms: ["BanMembers"],
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("menciona o escriba la ID del miembro que va a banear temporalmente del servidor.", { mention: msg.author.username, emoji: "noargs" }));

            const member = getMember(args[1]);
            if (!member) return msg.reply(bot.replyMessage("Este usuario no está en el servidor. Prueba con otro.", { emoji: "error" }));
            if (!args[2] || args[2] !== (`${parseInt(args[2].slice(0))}s`) && args[2] !== (`${parseInt(args[2].slice(0))}m`) && args[2] !== (`${parseInt(args[2].slice(0))}h`) && args[2] !== (`${parseInt(args[2].slice(0))}d`) && args[2] !== (`${parseInt(args[2].slice(0))}w`) && args[2] !== (`${parseInt(args[2].slice(0))}y`)) return msg.reply(bot.replyMessage("Escribe una duración válida. (10s/5m/1h/2w/1y)", { emoji: "error" }));

            let motivo = args.slice(3).join(" ");
            if (!motivo) motivo = "No se dio motivo.";
            if (motivo.length >= 511) motivo = `${motivo.slice(0, 508)}...`;

            if (member === msg.member) return msg.reply(bot.replyMessage("No te puedes banear a ti mismo, prueba con otro.", { emoji: "error" }));
            if (member === msg.guild?.members.me) return msg.reply(bot.replyMessage("¿Por qué yo?", { emoji: "error" }));
            if (member.roles.highest.position >= msg.member!.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedes banear a este miembro debido a que cuenta con un rol igual o superior al tuyo.", { emoji: "error" }));
            if (!member.manageable) return msg.reply(bot.replyMessage(`No puedo banear a ${member.user?.tag} ya que tiene un rol igual o superior al mío.`, { emoji: "error" }));
            if (!member.bannable) return msg.reply(bot.replyMessage(`No se puede banear a ${member.user?.tag}`, { emoji: "error" }));

            await member.ban({ reason: motivo }).then(async () => {
                const duration: string = humanize(toMs(args[2]));
                msg.reply(bot.replyMessage(`**${member.user?.tag}** (\`${member.user?.id}\`) ha sido baneado temporalmente del servidor.\n> Motivo: ${motivo}\n> Duración: ${duration}`, { emoji: "check" }));
                await member.user.send(`> ¡Has sido baneado de **${msg.guild?.name}** por **${msg.author.tag}**!\n**Motivo:** ${motivo}\n**Duración:** ${duration}`);

                setTimeout(async () => {
                    await msg.guild.members.unban(member.user.id).then(async () => {
                        await member.user.send(`> ¡Acabas de ser desbaneado de **${msg.guild.name}**!`);
                    }).catch(() => {});
                }, toMs(args[2]))
            }).catch(err => {
                console.error(err);
                msg.channel.send(bot.replyMessage("Hubo un error al intentar banear al usuario del servidor.", { emoji: "warning" }));
            });
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
