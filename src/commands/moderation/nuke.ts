import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChannelType, type ComponentType, type Interaction } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder.js";
import { CommandType } from "../../types/command.types.js";
import { getChannel } from "../../util/functions.js";

export default new CommandBuilder({
  type: CommandType.Legacy,
  name: "nuke",
  cooldown: 5,
  category: "Moderación",
  description: "Limpieza total de un canal (borra y vuelve a crear un canal).",
  usage: "[#canal | ID]",
  example: "#general",
  requiredClientPermissions: ["ManageChannels"],
  requiredMemberPermissions: ["ManageGuild"],
  async run(client, message, args) {
    const channel = getChannel(args[1], message) || message.channel;
    if (channel.type !== ChannelType.GuildText)
      return message.reply(client.beautifyMessage("Solo puedo hacer esta acción con canales de texto.", { emoji: "error" }));

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel("Sí")
        .setStyle(ButtonStyle.Success)
        .setCustomId("nuke-btn-yes"),
      new ButtonBuilder()
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
        .setCustomId("nuke-btn-no")
    )

    const confirmMessage = await message.reply({ content: "> ¿Estás seguro de hacer esto?", components: [row] });
    const filter = (m: Interaction) => m.user.id === message.author.id;
    const collector = confirmMessage.createMessageComponentCollector<ComponentType.Button>({ filter, max: 1, maxUsers: 1, time: 20_000 });

    const imgAttach = new AttachmentBuilder("https://imgur.com/LIyGeCR.gif", { name: "nuke.gif" });

    collector.once("collect", async (res) => {
      if (res.customId === "nuke-btn-yes") {
        try {
          const newChannel = await channel.clone();
          await newChannel.setParent(channel.parent);
          await newChannel.setPosition(channel.position);

          await channel.delete();

          await newChannel.send({ content: `**El canal ha explotado en mil pedazos...**`, files: [imgAttach] })
        } catch (error) {
          console.error(error);
          message.channel.send(client.beautifyMessage(`Ocurrió un error al intentar clonar y eliminar el canal.`, { emoji: "warning" }));
        }
      } else {
        confirmMessage.edit({ content: client.beautifyMessage("Operación cancelada.", { emoji: "error" }), components: [] })
          .then(msg => setTimeout(() => {
            if (msg.deletable)
              msg.delete();
          }, 5000));
      }
    });

    collector.once("end", (_, reason) => {
      if (reason === "limit") return;
      if (reason === "time")
      confirmMessage.edit({ content: client.beautifyMessage(`Operación cancelada por inactividad.`, { emoji: "error" }), components: [] })
        .then(msg => setTimeout(() => {
          if (msg.deletable)
          msg.delete();
        }, 5000));
    });

    return;
  }
});
