import { GuildMember } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "role",
    description: "Añade o elimina un rol a un miembro del servidor.",
    cooldown: 3,
    usage: "<@miembro | ID> <@rol | ID>",
    example: "@Neon#0001 @Personal",
    enabled: true,
    memberPerms: ["ManageRoles"],
    botPerms: ["ManageRoles"],
    async run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe una de las siguientes opciones:\n`add`: Añade a un miembro el rol mencionado.\n`remove`: Le quita el rol mencionado a un miembro.", { mention: msg.author.username, emoji: "noargs" }));
            if (!["add", "remove"].includes(args[1])) return msg.reply(bot.replyMessage("Opción no válida.", { emoji: "error" }));
            if (!args[2]) return msg.channel.send(bot.replyMessage("menciona o escribe la ID de un miembro del servidor.", { mention: msg.author.username, emoji: "noargs" }));

            const member: GuildMember | undefined = getMember(args[2]);
            if (!member) return msg.reply(bot.replyMessage("Parece que ese usuario no pertenece al servidor.", { emoji: "error" }));
            if (!args[3]) return msg.channel.send(bot.replyMessage("menciona o escribe la ID del rol.", { mention: msg.author.username, emoji: "noargs" }));

            const role = getRole(args[3]);
            if (!role) return msg.reply(bot.replyMessage("Ese rol no existe en el servidor.", { emoji: "error" }));

            if (args[1] === "add") {
                if (!args[3]) return msg.channel.send(bot.replyMessage(`menciona o escribe la ID del rol que vas a añadirle a ${member.user.tag}`, { mention: msg.author.username, emoji: "noargs" }));
                if (role?.position >= msg.member.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedes otorgar ese rol debido a que jerárquicamente es igual o superior al tuyo.", { emoji: "error" }));
                if (role?.position >= msg.guild!.members.me?.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedo añadir ese rol debido a que jerárquicamente igual o superior al mío.", { emoji: "error" }));
                if (role?.managed) return msg.reply(bot.replyMessage("No puedes otorgar un rol que está gestionado por una integración.", { emoji: "error" }));
                if (member.roles?.cache.has(role?.id)) return msg.reply(bot.replyMessage(`**${member.user.tag}** ya tenía ese rol.`, { emoji: "error" }));

                await member.roles.add(role.id, `El rol ${role.name} le fue otorgado a ${member.user.tag} por ${msg.author.tag}`).then(() => {
                    return msg.reply(bot.replyMessage(`Se le ha otorgado correctamente el rol **${role?.name}** a **${member.user?.tag}**.`, { emoji: "check" }));
                }).catch(err => {
                    console.error(err);
                    msg.channel.send(bot.replyMessage("Hubo un error al intentar añadir el rol al usuario.", { emoji: "warning" }));
                });
            } else {
                if (!args[3]) return msg.channel.send(bot.replyMessage(`menciona o escribe la ID del rol que vas a quitarle a ${member.user.tag}`, { mention: msg.author.username, emoji: "noargs" }));
                if (role?.position >= msg.member.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedes quitar ese rol debido a que jerárquicamente es igual o superior al tuyo.", { emoji: "error" }));
                if (role?.position >= msg.guild!.members.me?.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedo quitar ese rol debido a que es jerárquicamente igual o superior al mío.", { emoji: "error" }));
                if (role?.managed) return msg.reply(bot.replyMessage("No puedes quitarle un rol que está gestionado por una integración.", { emoji: "error" }));
                if (!member.roles?.cache.has(role?.id)) return msg.reply(bot.replyMessage(`**${member.user.tag}** no tenía ese rol.`, { emoji: "error" }));

                await member.roles.remove(role?.id, `El rol ${role.name} le fue removido a ${member.user.tag} por ${msg.author.tag}`).then(() => {
                    return msg.reply(bot.replyMessage(`El rol **${role?.name}** le fue removido a **${member.user?.tag}**`, { emoji: "check" }));
                }).catch(err => {
                    console.error(err);
                    msg.channel.send(bot.replyMessage("Hubo un error al intentar remover el rol al usuario.", { emoji: "warning" }));
                });
            }
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
