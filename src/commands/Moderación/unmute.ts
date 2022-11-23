import { MoonlightDatabase } from "../../databases";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "unmute",
    description: "Desmutea a un miembro del servidor.",
    cooldown: 3,
    usage: "<@miembro | ID>",
    example: "@Neon#0001 1h Flood",
    enabled: true,
    memberPerms: ["ManageRoles"],
    botPerms: ["ManageRoles"],
    async run(bot, msg, args, prefix, getUser, getMember) {
        try {
            const db = new MoonlightDatabase("muterole.json");
            if (db.has(msg.guildId)) {
                if (!args[1]) return msg.channel.send(bot.replyMessage("menciona o escribe la ID del miembro a desmutear.", { mention: msg.author.username, emoji: "noargs" }));

                const member = getMember(args[1]);
                if (!member) return msg.reply(bot.replyMessage("Parece que este usuario no pertenece al servidor.", { emoji: "error" }));

                if (member === msg.member) return msg.reply(bot.replyMessage("No te puedes desmutear a ti mismo.", { emoji: "error" }));
                if (member === msg.guild.members.me) return msg.reply(bot.replyMessage("Sigo aquí.", { emoji: "error" }));

                if (member.roles.highest.position >= msg.member.roles.highest.position) return msg.reply(bot.replyMessage(`No puedo desmutear a **${member.user.tag}** debido a que tiene un rol jerárquicamente igual o superior al tuyo.`, { emoji: "error" }));
                if (!member.manageable) return msg.reply(bot.replyMessage(`No logré desmutear a **${member.user.tag}** debido a que jerárquicamente tiene un rol igual o superior al mío.`, { emoji: "error" }));
                if (!member.roles.cache.has(db.get(msg.guildId) as string)) return msg.reply(bot.replyMessage(`${member.user.tag} no estaba muteado.`, { emoji: "error" }));

                await member.roles.remove(db.get(msg.guildId) as string).then(async () => {
                    msg.reply(bot.replyMessage(`**${member.user.tag}** (\`${member.user.id}\`) ha sido desmuteado del servidor.`, { emoji: "check" }));

                    try {
                        await member.user.send(`> ¡Acabas de ser desmuteado de **${msg.guild.name}** por **${msg.author.tag}**!`);
                    } catch (error) {
                        msg.channel.send(bot.replyMessage("No fue posible enviarle un mensaje privado avisándole sobre su desmuteo, tal vez se deba a que tiene cerrado los mensajes privados.", { emoji: "warning" }));
                    }
                }).catch(err => {
                    console.error(err);
                    msg.channel.send(bot.replyMessage("Ocurrió un error al intentar desmutear a este usuario.", { emoji: "warning" }));
                });
            } else return msg.reply(bot.replyMessage(`Todavía no puedes mutear a nadie en este momento debido a que no has configurado un rol para mutear en el servidor. Para ello haz uso del comando \`${prefix}muterole set\`.`, { emoji: "error" }));
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
