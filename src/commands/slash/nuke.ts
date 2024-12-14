import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  ComponentType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type TextChannel,
  type Interaction
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Delete and then create again a text channel.")
    .setDescriptionLocalizations({
      "es-ES": "Elimina y crea de nuevo un canal de texto."
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption(ch =>
      ch
        .setName("channel")
        .setDescription("Choose a channel to nuke.")
        .setDescriptionLocalizations({
          "es-ES": "Elige un canal para explotar."
        })
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    ),
  testGuildOnly: true,
  clientPermissions: ["ManageChannels"],
  async run(interaction) {
    if (!interaction.inGuild() || !interaction.guild || !interaction.channel)
      return interaction.reply({
        content: "Este comando debe usarse en un servidor.",
        ephemeral: true
      });
    const channel =
      (interaction.options.getChannel("channel", false) as TextChannel) ??
      interaction.channel;

    const yesBtn = new ButtonBuilder()
      .setLabel("Sí")
      .setStyle(ButtonStyle.Danger)
      .setCustomId("nuke-yes-btn");

    const noBtn = new ButtonBuilder()
      .setLabel("No")
      .setStyle(ButtonStyle.Secondary)
      .setCustomId("nuke-no-btn");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      noBtn,
      yesBtn
    );

    const confirmation = await interaction.reply({
      content: `¿Estás seguro de querer explotar el canal <#${channel.id}>?`,
      components: [row]
    });
    const filter = (i: Interaction) => i.user.id === interaction.user.id;

    const imgAttach = new AttachmentBuilder("https://imgur.com/LIyGeCR.gif", {
      name: "nuke.gif"
    });

    try {
      const response = await confirmation.awaitMessageComponent({
        filter,
        time: 60_000,
        componentType: ComponentType.Button
      });

      if (response.customId === "nuke-yes-btn") {
        try {
          const newChannel = await channel.clone();
          await newChannel.setParent(channel.parent);
          await newChannel.setPosition(channel.position);
          await channel.delete();
          await newChannel.send({
            content: `** El canal ha explotado en mil pedazos...**`,
            files: [imgAttach]
          });
        } catch (error) {
          console.error(error);
          await interaction.editReply({
            content: `Hubo un error al intentar clonar el canal.`,
            components: []
          });
        }
      } else if (response.customId === "nuke-no-btn") {
        await response.update({ content: "Acción cancelada.", components: [] });
      }
    } catch (error) {
      console.log(error);
      yesBtn.setDisabled(true);
      noBtn.setDisabled(true);
      await interaction.editReply({
        content: "Acción cancelada por inactividad.",
        components: [row]
      });
    }
    return;
  }
});
