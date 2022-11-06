import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, Interaction } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "bugreport",
    description: "Envía reporte de bug del bot al staff.",
    cooldown: 3,
    aliases: ["report", "bug"],
    usage: "<reporte>",
    example: "Reporte de ejemplo.",
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.reply(`**${msg.author.username}**, escribe el reporte de algún bug que hayas encontrado en el bot aquí. Recuerda que puedes adjuntar imagenes o vídeos que aporten a evidenciar de mejor manera el bug.\n__Nota:__ Cualquier reporte o adjunto sin sentido será rechazado.`);

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                .setStyle(ButtonStyle.Success)
                .setLabel("Sí")
                .setCustomId("si"),
                new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("No")
                .setCustomId("no")
            )

            const confirm = await msg.reply({ content: `¿Estás seguro de enviar este reporte?`, components: [row] });
            const collector = confirm.createMessageComponentCollector<ComponentType.Button>({ filter: (m: Interaction) => m.user.id === msg.author.id, max: 1, maxUsers: 1, time: 20_000 });

            collector.once("collect", res => {
                if (res.customId === "si") {
                    const embed = new EmbedBuilder()
                    .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({ size: 2048, extension: "png" }) })
                    .setTitle("¡Ha llegado un reporte de bug!")
                    .setDescription(`Reporte enviado por ${msg.author} (\`${msg.author.id}\`)\n__Reporte:__ \`\`\`\n${args.slice(1).join(' ')}\n\`\`\``)
                    .addFields({ name: "Adjuntos", value: msg.attachments.map(att => att.proxyURL).join('\n') || "No envió adjuntos." })
                    .setColor("Random");

                    bot.hook.send({ embeds: [embed] }).then(() => {
                        confirm.edit({ content: `Tu reporte fue enviado correctamente! Asegúrate de tener activo los mensajes directos para avisarte sobre tu reporte.`, components: [] });
                    }).catch(error => {
                        confirm.edit({ content: `Ocurrió un error al intentar enviar tu reporte. Intenta más tarde.`, components: [] }).then(message => setTimeout(() => message.delete(), 10000));
                        console.error(error);
                    });
                } else confirm.edit({ content: `Tu reporte no fue enviado.`, components: [] }).then(message => setTimeout(() => message.delete(), 10000));
            });

            collector.once("end", (collected, reason) => {
                // console.log({ collected, reason });
                if (reason === "limit") return;
                if (reason === "time") confirm.edit({ content: `Tu reporte fue cancelado debido a tiempo expirado.`, components: [] }).then(message => setTimeout(() => message.delete(), 10000));
            });
        } catch (err) {
            bot.error("Hubo un error al intentar efectuar este comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});