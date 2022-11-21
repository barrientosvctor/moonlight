import { TextChannel } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "lock",
    description: "Bloquea el acceso a enviar mensajes en el canal mencionado.",
    cooldown: 3,
    usage: "[#canal | ID]",
    example: "#General",
    enabled: true,
    memberPerms: ["ManageChannels"],
    botPerms: ["ManageRoles", "ManageChannels"],
    async run(bot, msg, args, prefix, getUser, getMember, getChannel) {
        try {
            const channel = getChannel(args[1]) || msg.channel
            if (!channel) return msg.reply(bot.replyMessage("Parece que ese canal no pertenece al servidor.", { emoji: "error" }));
            if (channel instanceof TextChannel) {
                if (!channel.permissionsFor(msg.guild.roles.everyone).has(["SendMessages", "AddReactions"])) return msg.reply(bot.replyMessage(`El canal ${channel} ya estaba bloqueado.`, { emoji: "error" }));

                await channel.permissionOverwrites.edit(msg.guild.roles.everyone, { "SendMessages": false, "AddReactions": false }).then(() => {
                    return channel.send(bot.replyMessage("El canal ha sido bloqueado.", { emoji: "warning" }));
                }).catch(err => {
                    console.error(err);
                    msg.channel.send(bot.replyMessage("Ocurrió un error al intentar bloquear el canal", { emoji: "warning" }));
                });
            }
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
