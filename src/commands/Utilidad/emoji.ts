import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "emoji",
    description: "Administra los emojis de tu servidor con este comando!",
    cooldown: 3,
    usage: "<add / remove / rename> <emoji>",
    example: "rename RappiHappu Happy",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escriba alguna de las siguientes opciones:\n`add`: Añade un nuevo emoji a su servidor.\n`remove`: Elimina un emoji de su servidor.\n`rename`: Renombra un emoji del servidor.", { mention: msg.author.username, emoji: "noargs" }));
            if (!["add", "remove", "rename"].includes(args[1])) return msg.reply(bot.replyMessage("Opción no válida.", { emoji: "error" }));

            switch (args[1]) {
                case "add":
                    if(!args[2]) return msg.channel.send(bot.replyMessage("escribe el nombre del emoji que vas a añadir.", { mention: msg.author.username, emoji: "noargs" }));
                    if (msg.attachments?.size === 0) return msg.reply(bot.replyMessage("Adjunta al mensaje el archivo del emoji que vas a añadir al servidor.", { emoji: "error" }));

                    await msg.guild?.emojis?.create({ attachment: msg.attachments?.first().proxyURL, name: args[2], reason: `Emoji añadido por: ${msg.author.tag}` }).then(emoji => {
                        const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
                        .setDescription(`${bot.getEmoji('check')} Muy bien! El emoji ${emoji.animated ? `<a:${emoji.name}:${emoji.id}>` : `<:${emoji.name}:${emoji.id}>`} fue añadido correctamente al servidor.\n\n**Nombre:** ${emoji.name}\n**ID:** ${emoji.id}\n**¿Animado?** ${emoji.animated ? `Sí.` : `No.`}\n**Añadido por:** ${msg.author}`)
                        .setImage(emoji.url);
                        msg.reply({ embeds: [embed] });
                    }).catch(err => {
                        console.error(err);
                        msg.channel.send(`Hubo un error al intentar añadir el emoji al servidor.`);
                    });
                break;
                case "remove":
                    if (!args[2]) return msg.channel.send(bot.replyMessage("escribe el nombre del emoji que vas a eliminar del servidor.", { mention: msg.author.username, emoji: "noargs" }));
                    const emoji = msg.guild.emojis.cache.find(e => e.name === args[2]) || msg.guild.emojis.cache.find(e => e.name === args[2].split(':')[1]);
                    if (!emoji) return msg.reply(bot.replyMessage(`El emoji **${args[2]}** no existe en el servidor, asegurate de escribir bien su nombre.`, { emoji: "error" }));

                    if (emoji.deletable) {
                        await emoji.delete(`Emoji eliminado por: ${msg.author.tag}`);
                        return msg.reply(bot.replyMessage(`El emoji *${args[2]}* fue eliminado del servidor.`, { emoji: "check" }));
                    } else msg.reply(bot.replyMessage("Este emoji no se puede eliminar, intenta con otro.", { emoji: "error" }));
                break;
                case "rename":
                    if (!args[2]) return msg.channel.send(bot.replyMessage("escribe el nombre del emoji que va a ser cambiado de nombre.", { mention: msg.author.username, emoji: "noargs" }));
                    const emojii = msg.guild.emojis.cache.find(e => e.name === args[2]) || msg.guild.emojis.cache.find(e => e.name === args[2].split(':')[1]);
                    if (!emojii) return msg.reply(bot.replyMessage(`El emoji **${args[2]}** no existe en el servidor, asegurate de escribir bien su nombre.`, { emoji: "error" }));
                    if (!args[3]) return msg.channel.send(bot.replyMessage(`escribe el nuevo nombre que tendrá el emoji *${emojii.name}*`, { mention: msg.author.username, emoji: "noargs" }));

                    await emojii.edit({ name: args[3], reason: `Emoji modificado por: ${msg.author.tag}` }).then(emoji => {
                        msg.reply(bot.replyMessage(`El emoji *${args[2]}* ha sido cambiado de nombre a **${emoji.name}** éxitosamente!`, { emoji: "check" }));
                    }).catch(err => {
                        console.error(err);
                        msg.channel.send(bot.replyMessage("hubo un error al intentar modificar el emoji.", { mention: msg.author.username, emoji: "warning" }));
                    });
                break;
            }
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});