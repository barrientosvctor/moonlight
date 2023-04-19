import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ComponentType, Interaction, TextChannel } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "nuke",
  description: "Una limpíeza total del canal que menciones.",
  cooldown: 3,
  usage: "[#canal | ID]",
  example: "#General",
  enabled: true,
  memberPerms: ["ManageGuild"],
  botPerms: ["ManageChannels"],
  async run(bot, msg, args, prefix, getUser, getMember, getChannel) {
    try {
      const channel = getChannel(args[1]) || msg.channel;
      if (channel instanceof TextChannel) {
        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setLabel("Sí")
            .setStyle(ButtonStyle.Success)
            .setCustomId("si"),
          new ButtonBuilder()
            .setLabel("No")
            .setStyle(ButtonStyle.Danger)
            .setCustomId("no")
        )

        const confirmMsg = await msg.reply({ content: `¿Estás seguro de hacer esto?`, components: [row] });
        const collector = confirmMsg.createMessageComponentCollector<ComponentType.Button>({ filter: (m: Interaction) => m.user.id === msg.author.id, max: 1, maxUsers: 1, time: 20_000 });

        collector.once("collect", async res => {
          if (res.customId === "si") {
            await channel.clone().then(async ch => {
              ch.setParent(channel.parent);
              ch.setPosition(channel.position);
              await channel.delete().then(() => {
                return ch.send({ content: `**El canal ha explotado en mil pedazos...**`, files: [new AttachmentBuilder("https://imgur.com/LIyGeCR.gif", { name: "nuke.gif" })] })
              }).catch(() => {});
            }).catch(err => {
              console.error(err);
              msg.channel.send(bot.replyMessage(`Ocurrió un error al intentar eliminar el canal.`, { emoji: "warning" }));
            });
          } else {
            confirmMsg.edit({ content: bot.replyMessage("Operación cancelada.", { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 5000));
          }
        });

        collector.once("end", (collected, reason) => {
          // console.log({ collected, reason });
          if (reason === "limit") return;
          if (reason === "time") confirmMsg.edit({ content: bot.replyMessage(`Operación cancelada por inactividad.`, { emoji: "error" }), components: [] }).then(message => setTimeout(() => message.delete(), 5000));
        });
      } else return msg.reply(bot.replyMessage("Solo puedo hacer esta acción con canales de texto.", { emoji: "error" }));
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
