import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  type GuildMember
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
import { toMs } from "../../util/functions.js";
import {
  HumanizeDuration,
  HumanizeDurationLanguage
} from "humanize-duration-ts";
import { TIMEOUT_LIMIT } from "../../constants.js";
export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Times a guild member out.")
    .setDescriptionLocalizations({
      "es-ES": "Aisla a un miembro del servidor."
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(user =>
      user
        .setName("member")
        .setDescription("Choose a member to time out.")
        .setDescriptionLocalizations({
          "es-ES": "Elige a un miembro para aislar."
        })
        .setRequired(true)
    )
    .addNumberOption(num =>
      num
        .setName("seconds")
        .setDescription("Specify the seconds of the timeout.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica los segundos del aislamiento."
        })
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(59)
    )
    .addNumberOption(num =>
      num
        .setName("minutes")
        .setDescription("Specify the minutes of the timeout.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica los minutos del aislamiento."
        })
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(59)
    )
    .addNumberOption(num =>
      num
        .setName("hours")
        .setDescription("Specify the hours of the timeout.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica las horas del aislamiento."
        })
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(24)
    )
    .addNumberOption(num =>
      num
        .setName("days")
        .setDescription("Specify the days of the timeout.")
        .setDescriptionLocalizations({
          "es-ES": "Especifica los días del aislamiento."
        })
        .setRequired(false)
        .setMinValue(0)
        .setMaxValue(30)
    )
    .addStringOption(input =>
      input
        .setName("reason")
        .setDescription("Write the reason why you're timeout this member.")
        .setDescriptionLocalizations({
          "es-ES": "Escriba la razón del por qué estás aislando a éste miembro."
        })
        .setRequired(false)
        .setMinLength(0)
        .setMaxLength(255)
    ),
  clientPermissions: ["ModerateMembers"],
  async run(interaction) {
    const member = interaction.options.getMember("member") as GuildMember;
    const [days, hours, minutes, seconds] = [
      interaction.options.getNumber("days", false),
      interaction.options.getNumber("hours", false),
      interaction.options.getNumber("minutes", false),
      interaction.options.getNumber("seconds", true)
    ];

    const reason = interaction.options.getString("reason") ?? "Ninguno";

    if (member.isCommunicationDisabled())
      return interaction.reply({
        content: "Este usuario ya estaba aislado!",
        ephemeral: true
      });

    const humanizeService = new HumanizeDuration(
      new HumanizeDurationLanguage()
    );

    humanizeService.setOptions({
      language: "es"
    });

    const timeToMs = toMs({
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    });

    if (timeToMs > TIMEOUT_LIMIT)
      return interaction.reply({
        content: `La duración del aislamiento no puede ser mayor a ${humanizeService.humanize(TIMEOUT_LIMIT)}.`,
        ephemeral: true
      });

    try {
      await member.timeout(timeToMs, reason);
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: "No es posible aislar a éste usuario, prueba con otro.",
        ephemeral: true
      });
    }

    return interaction.reply(
      `${member.user.username} fue aislado durante ${humanizeService.humanize(timeToMs)}.\n> Razón: ${reason}`
    );
  }
});
