import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type TextChannel
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock command.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addSubcommand(cmd =>
      cmd
        .setName("set")
        .setDescription(
          "Blocks access to sending messages in some text channel."
        )
        .addChannelOption(ch =>
          ch
            .setName("channel")
            .setDescription(
              "Choose a channel to block the access for everyone."
            )
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addBooleanOption(b =>
          b
            .setName("hidden")
            .setDescription("Should the bot's response be hidden?")
            .setRequired(false)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("remove")
        .setDescription(
          "Adds back access to sending messages in a text channel."
        )
        .addChannelOption(ch =>
          ch
            .setName("channel")
            .setDescription("Choose a channel to unblock.")
            .setRequired(false)
            .addChannelTypes(ChannelType.GuildText)
        )
        .addBooleanOption(b =>
          b
            .setName("hidden")
            .setDescription("Should the bot's response be hidden?")
            .setRequired(false)
        )
    ),
  testGuildOnly: true,
  clientPermissions: ["ManageChannels", "ManageRoles"],
  async run(interaction) {
    if (!interaction.inGuild() || !interaction.guild || !interaction.channel)
      return interaction.reply({
        content: "El comando debe ejecutarse en un servidor.",
        ephemeral: true
      });

    const subcommand = interaction.options.getSubcommand();

    const channel =
      (interaction.options.getChannel("channel", false) as TextChannel) ??
      interaction.channel;
    const hidden = interaction.options.getBoolean("hidden", false) ?? false;

    if (subcommand === "set") {
      if (
        !channel
          .permissionsFor(interaction.guild.roles.everyone)
          .has(["SendMessages", "AddReactions"])
      )
        return interaction.reply({
          content: `El canal <#${channel.id}> ya estaba bloqueado.`,
          ephemeral: true
        });

      try {
        await channel.permissionOverwrites.edit(
          interaction.guild.roles.everyone,
          {
            SendMessages: false,
            AddReactions: false
          }
        );
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: "Ocurrió un error al intentar bloquear el canal.",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: `El canal <#${channel.id}> ha sido bloqueado.`,
        ephemeral: hidden
      });
    } else if (subcommand === "remove") {
      if (
        channel
          .permissionsFor(interaction.guild.roles.everyone)
          .has(["SendMessages", "AddReactions"])
      )
        return interaction.reply({
          content: `El canal <#${channel.id}> no estaba bloqueado.`,
          ephemeral: true
        });

      try {
        await channel.permissionOverwrites.edit(
          interaction.guild.roles.everyone,
          {
            SendMessages: true,
            AddReactions: true
          }
        );
      } catch (error) {
        console.error(error);
        return interaction.reply({
          content: "Ocurrió un error al intentar bloquear el canal.",
          ephemeral: true
        });
      }

      return interaction.reply({
        content: `El canal <#${channel.id}> ha sido desbloqueado.`,
        ephemeral: hidden
      });
    } else {
      return;
    }
  }
});
