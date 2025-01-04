import {
  ChannelType,
  PermissionFlagsBits,
  SlashCommandBuilder,
  type TextChannel
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
import {
  HumanizeDuration,
  HumanizeDurationLanguage
} from "humanize-duration-ts";
import { toMs } from "../../util/functions.js";
import { SLOWMODE_LIMIT } from "../../constants.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("slowmode")
    .setDescription("Sets slow mode in a text channel.")
    .setDescriptionLocalizations({
      "es-ES": "Establece modo lento en un canal de texto."
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption(ch =>
      ch
        .setName("channel")
        .setDescription("Specify the channel to apply slow mode.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica el canal para aplicar el modo lento."
        })
        .setRequired(false)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addNumberOption(num =>
      num
        .setName("hours")
        .setDescription("Specify the hours of the slow mode.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica las horas del modo lento."
        })
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(6)
    )
    .addNumberOption(num =>
      num
        .setName("minutes")
        .setDescription("Specify the minutes of the slow mode.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica los minutos del modo lento."
        })
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(59)
    )
    .addNumberOption(num =>
      num
        .setName("seconds")
        .setDescription("Specify the seconds of the slow mode.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica los segundos del modo lento."
        })
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(59)
    )
    .addBooleanOption(b =>
      b
        .setName("hidden")
        .setDescription("Should the bot's response be hidden?")
        .setDescriptionLocalizations({
          "es-ES": "¿La respuesta del bot debería estar oculta?"
        })
        .setRequired(false)
    ),
  clientPermissions: ["ManageChannels"],
  async run(interaction) {
    if (!interaction.inGuild() || !interaction.guild || !interaction.channel)
      return interaction.reply({
        content: "El comando debe ejecutarse en un servidor.",
        ephemeral: true
      });

    const channel =
      (interaction.options.getChannel("channel", false) as TextChannel) ??
      interaction.channel;
    const [hours, minutes, seconds] = [
      interaction.options.getNumber("hours", false),
      interaction.options.getNumber("minutes", false),
      interaction.options.getNumber("seconds", false)
    ];
    const hidden = interaction.options.getBoolean("hidden", false) ?? false;

    const humanizeService = new HumanizeDuration(
      new HumanizeDurationLanguage()
    );

    humanizeService.setOptions({
      language: "es"
    });

    const ms = toMs({
      hours: hours,
      minutes: minutes,
      seconds: seconds
    });
    const toSeconds = Math.ceil(ms / 1000);

    if (toSeconds > SLOWMODE_LIMIT)
      return interaction.reply({
        content: `El tiempo del modo lento no puede ser mayor a ${humanizeService.humanize(SLOWMODE_LIMIT * 1000)}.`,
        ephemeral: true
      });

    await channel.setRateLimitPerUser(toSeconds);

    return interaction.reply({
      content:
        channel.rateLimitPerUser == 0
          ? `Modo lento removido en el canal <#${channel.id}>.`
          : `Ahora el canal <#${channel.id}> tiene un modo lento de ${humanizeService.humanize(ms)}.`,
      ephemeral: hidden
    });
  }
});
