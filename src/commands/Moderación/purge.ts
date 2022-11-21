import { TextChannel } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "purge",
    description: "Borra una cantidad de mensajes en el chat",
    cooldown: 3,
    usage: "<número>",
    example: "20",
    enabled: true,
    memberPerms: ["ManageMessages"],
    botPerms: ["ManageMessages"],
    async run(bot, msg, args, prefix, getUser, getMember, getChannel) {
        try {
            if (msg.channel instanceof TextChannel) {
                if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el número de mensajes que vas a eliminar en este chat.", { mention: msg.author.username, emoji: "noargs" }));
                if (!Number(args[1])) return msg.reply(bot.replyMessage("Debes de escribir un número válido.", { emoji: "error" }));
                if (Number(args[1]) < 1 || Number(args[1]) > 100) return msg.reply(bot.replyMessage("La cantidad de mensajes a eliminar debe ser entre **1** y **100** mensajes.", { emoji: "error" }));
                if (msg.deletable) await msg.delete();

                await msg.channel.bulkDelete(parseInt(args[1]), true).then(() => {
                    msg.channel.send(bot.replyMessage(`${parseInt(args[1])} mensajes eliminados.`, { emoji: "check" })).then(message => setTimeout(() => message.delete(), 10000)).catch(() => {});
                }).catch(err => {
                    console.error(err);
                    msg.channel.send(bot.replyMessage("Ocurrió un error al intentar eliminar los mensajes.", { emoji: "warning" }));
                });
            } else return msg.reply(bot.replyMessage("Solo puedo hacer esta acción con canales de texto.", { emoji: "error" }));
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
