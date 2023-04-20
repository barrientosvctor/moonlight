import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, Interaction } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "botsuggest",
  description: "Envía sugerencias al bot.",
  cooldown: 3,
  aliases: ["botsuggestion"],
  usage: "<sugerencia>",
  example: "Sugerencia de ejemplo.",
  enabled: true,
  async run(bot, msg, args) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe la sugerencia que vas a enviar al staff. Recuerda que puedes adjuntar imagenes o vídeos que aporten a la sugerencia.\n__Nota:__ Cualquier sugerencia o adjunto sin sentido será rechazado.", { mention: msg.author.username, emoji: "noargs" }));

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

      const confirm = await msg.reply({ content: `¿Estás seguro de enviar esta sugerencia?`, components: [row] });
      const collector = confirm.createMessageComponentCollector<ComponentType.Button>({ filter: (m: Interaction) => m.user.id === msg.author.id, max: 1, maxUsers: 1, time: 20_000 });

      collector.once("collect", res => {
        if (res.customId === "si") {
          const embed = new EmbedBuilder()
          .setAuthor({ name: msg.author.tag, iconURL: msg.author.displayAvatarURL({ size: 2048, extension: "png" }) })
          .setTitle("¡Ha llegado una sugerencia!")
          .setDescription(`Sugerencia enviada por ${msg.author} (\`${msg.author.id}\`)\n__Sugerencia:__ \`\`\`\n${args.slice(1).join(' ')}\n\`\`\``)
          .addFields({ name: "Adjuntos", value: msg.attachments.map(att => att.proxyURL).join('\n') || "No envió adjuntos." })
          .setColor("Random");

          bot.hook.send({ embeds: [embed] }).then(() => {
            confirm.edit({ content: bot.replyMessage("La sugerencia fue enviada correctamente! Asegúrate de tener activo los mensajes directos para avisarte sobre tu sugerencia.", { emoji: "check" }), components: [] });
          }).catch(error => {
              confirm.edit({ content: bot.replyMessage("Ocurrió un error al intentar enviar tu sugerencia. Intenta más tarde.", { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 10000));
              console.error(error);
            });
        } else confirm.edit({ content: bot.replyMessage("Tu sugerencia no fue enviada.", { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 10000));
      });

      collector.once("end", (collected, reason) => {
        // console.log({ collected, reason });
        if (reason === "limit") return;
        if (reason === "time") confirm.edit({ content: bot.replyMessage("Tu sugerencia fue cancelada debido a tiempo expirado.", { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 10000));
      });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
