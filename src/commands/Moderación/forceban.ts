import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "forceban",
    description: "Banea a cualquier usuario de Discord aunque no esté en el servidor.",
    cooldown: 3,
    usage: "<@usuario | ID> [motivo]",
    example: "@Neon#0001 Un motivo",
    enabled: true,
    memberPerms: ["BanMembers"],
    botPerms: ["BanMembers"],
    async run(bot, msg, args, prefix, getUser) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("menciona o escriba la ID del usuario que va a banear del servidor.", { mention: msg.author.username, emoji: "noargs" }));

            const user = await getUser(args[1]);
            if (!user) return msg.reply(bot.replyMessage("Este usuario no existe. Prueba con otro.", { emoji: "error" }));

            let motivo = args.slice(2).join(" ");
            if (!motivo) motivo = "No se dio motivo.";
            if (motivo.length >= 511) motivo = `${motivo.slice(0, 508)}...`;

            if (user === msg.author) return msg.reply(bot.replyMessage("No te puedes banear a ti mismo, prueba con otro.", { emoji: "error" }));
            if (user === msg.guild?.members.me?.user) return msg.reply(bot.replyMessage("¿Por qué yo?", { emoji: "error" }));

            await msg.guild.members.ban(user.id, { reason: motivo }).then(() => {
                return msg.reply(bot.replyMessage(`**${user.tag}** (\`${user.id}\`) ha sido forzadamente baneado del servidor.\n> Motivo: ${motivo}`, { emoji: "check" }));
            }).catch(err => {
                console.error(err);
                msg.channel.send(bot.replyMessage("Hubo un error al intentar banear al usuario del servidor.", { emoji: "warning" }));
            });
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
