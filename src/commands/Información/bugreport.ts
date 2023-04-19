import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, Interaction } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "bugreport",
  description: "Envía reporte de bug del bot al staff.",
  cooldown: 3,
  aliases: ["report", "bug"],
  usage: "<reporte>",
  example: "Reporte de ejemplo.",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.reply(bot.replyMessage("escribe el reporte de algún bug que hayas encontrado en el bot aquí. Recuerda que puedes adjuntar imagenes o vídeos que aporten a evidenciar de mejor manera el bug.\n__Nota:__ Cualquier reporte o adjunto sin sentido será rechazado.", { mention: msg.author.username, emoji: "noargs" }));

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setLabel("Sí")
          .setCustomId("si"),
        new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setLabel("No")
          .setCustomId("no")
      );

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
            confirm.edit({ content: bot.replyMessage("Tu reporte fue enviado correctamente! Asegúrate de tener activo los mensajes directos para avisarte sobre tu reporte.", { emoji: "check" }), components: [] });
          }).catch(error => {
              confirm.edit({ content: bot.replyMessage("Ocurrió un error al intentar enviar tu reporte. Intenta más tarde.", { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 10000));
              console.error(error);
            });
        } else confirm.edit({ content: bot.replyMessage("Tu reporte no fue enviado.", { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 10000));
      });

      collector.once("end", (collected, reason) => {
        // console.log({ collected, reason });
        if (reason === "limit") return;
        if (reason === "time") confirm.edit({ content: bot.replyMessage("Tu reporte fue cancelado debido a tiempo expirado.", { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 10000));
      });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
