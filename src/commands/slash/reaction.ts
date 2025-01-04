import {
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  bold
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
import {
  type AnimeProviderResponse,
  fetchAnimeGIF
} from "../../util/functions.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("reaction")
    .setDescription("Reaction commands.")
    .setDescriptionLocalizations({
      "es-ES": "Comandos de reacción."
    })
    .addSubcommand(cmd =>
      cmd
        .setName("bite")
        .setDescription("Bite a member.")
        .setDescriptionLocalizations({
          "es-ES": "Muerde a un miembro."
        })
        .addUserOption(user =>
          user
            .setName("member")
            .setDescription("Choose the member to bite.")
            .setDescriptionLocalizations({
              "es-ES": "Elige al miembro a morder."
            })
            .setRequired(true)
        )
    )
    .addSubcommand(cmd => cmd.setName("cry").setDescription("Just cry."))
    .setDescriptionLocalizations({
      "es-ES": "Sólo llora."
    })
    .addSubcommand(cmd =>
      cmd.setName("dance").setDescription("Dance to express your happiness.")
    )
    .setDescriptionLocalizations({
      "es-ES": "Baila para expresar tu felicidad."
    })
    .addSubcommand(cmd => cmd.setName("facepalm").setDescription("Facepalm."))
    .setDescriptionLocalizations({
      "es-ES": "Palmada en la cara."
    })
    .addSubcommand(cmd => cmd.setName("happy").setDescription("You are happy!"))
    .setDescriptionLocalizations({
      "es-ES": "¡Estás feliz!"
    })
    .addSubcommand(cmd =>
      cmd
        .setName("hug")
        .setDescription("Hug a member.")
        .setDescriptionLocalizations({
          "es-ES": "Abraza a un miembro."
        })
        .addUserOption(user =>
          user
            .setName("member")
            .setDescription("Choose a member to hug.")
            .setDescriptionLocalizations({
              "es-ES": "Elige a un miembro para abrazar."
            })
            .setRequired(true)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("kiss")
        .setDescription("Kiss a member.")
        .setDescriptionLocalizations({
          "es-ES": "Besa a un miembro."
        })
        .addUserOption(user =>
          user
            .setName("member")
            .setDescription("Choose a member to kiss.")
            .setDescriptionLocalizations({
              "es-ES": "Elige a un miembro para besar."
            })
            .setRequired(true)
        )
    )
    .addSubcommand(cmd =>
      cmd.setName("laugh").setDescription("You are laughing!")
    )
    .setDescriptionLocalizations({
      "es-ES": "¡Estás riéndote!"
    })
    .addSubcommand(cmd =>
      cmd
        .setName("pat")
        .setDescription("Give a pat to a member.")
        .setDescriptionLocalizations({
          "es-ES": "Da una palmadita a un miembro."
        })
        .addUserOption(user =>
          user
            .setName("member")
            .setDescription("Choose a member to pat.")
            .setDescriptionLocalizations({
              "es-ES": "Elige un miembro para darle una palmadita."
            })
            .setRequired(true)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("slap")
        .setDescription("Slap a member.")
        .setDescriptionLocalizations({
          "es-ES": "Dale una bofetada a un miembro."
        })
        .addUserOption(user =>
          user
            .setName("member")
            .setDescription("Choose a member to slap.")
            .setDescriptionLocalizations({
              "es-ES": "Elige un miembro para darle una bofetada."
            })
            .setRequired(true)
        )
    )
    .addSubcommand(cmd =>
      cmd.setName("wave").setDescription("Wave to everyone at chat!")
    )
    .setDescriptionLocalizations({
      "es-ES": "¡Saluda a todos en el chat!"
    })
    .addSubcommand(cmd =>
      cmd
        .setName("wink")
        .setDescription("Wink a member.")
        .setDescriptionLocalizations({
          "es-ES": "Guíñale el ojo a un miembro."
        })
        .addUserOption(user =>
          user
            .setName("member")
            .setDescription("Choose a member to wink.")
            .setDescriptionLocalizations({
              "es-ES": "Elige a un miembro para guiñarle el ojo."
            })
            .setRequired(true)
        )
    ),
  async run(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let data: AnimeProviderResponse;
    const embed = new EmbedBuilder();
    if (subcommand === "bite") {
      const member = interaction.options.getMember("member") as GuildMember;

      if (!member)
        return interaction.reply("Este usuario no está en el servidor.");
      if (member.user.id === interaction.user.id)
        return interaction.reply({
          content: "¿Por qué te morderías a ti mismo?",
          ephemeral: true
        });

      data = await fetchAnimeGIF("bite");
      embed
        .setDescription(
          `${bold(interaction.user.username)} modió a ${bold(member.user.username)}.`
        )
        .setColor("Random")
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "cry") {
      data = await fetchAnimeGIF("cry");
      embed
        .setDescription(`${bold(interaction.user.username)} está llorando.`)
        .setColor("DarkGrey")
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "dance") {
      data = await fetchAnimeGIF("dance");
      embed
        .setColor("Random")
        .setImage(data.url)
        .setDescription(`${bold(interaction.user.username)} está bailando.`);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "facepalm") {
      data = await fetchAnimeGIF("facepalm");
      embed
        .setDescription(`${bold(interaction.user.username)} está decepcionado.`)
        .setColor("DarkGrey")
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "happy") {
      data = await fetchAnimeGIF("happy");
      embed
        .setDescription(`${bold(interaction.user.username)} está feliz! :D`)
        .setColor("Random")
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "hug") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("hug");

      if (!member)
        return interaction.reply({
          content: "No pude encontrar a esa persona en el servidor.",
          ephemeral: true
        });
      if (member.user.id === interaction.user.id)
        return interaction.reply({
          content: "No puedes abrazarte a ti mismo, eso sería muy raro jeje.",
          ephemeral: true
        });

      embed
        .setColor("Random")
        .setDescription(
          `¡${bold(interaction.user.username)} le dió un fuerte abrazo a ${bold(member.user.username)}!`
        )
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "kiss") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("kiss");

      if (!member)
        return interaction.reply({
          content: "No pude encontrar a esa persona en el servidor.",
          ephemeral: true
        });
      if (member.user.id === interaction.user.id)
        return interaction.reply({
          content: "No puedes besarte a ti mismo, eso sería muy raro jeje.",
          ephemeral: true
        });

      embed
        .setImage(data.url)
        .setColor("Random")
        .setDescription(
          `¡${bold(interaction.user.username)} le dio un beso a ${bold(member.user.username)}!`
        );
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "laugh") {
      data = await fetchAnimeGIF("laugh");
      embed
        .setDescription(
          `${bold(interaction.user.username)} se ríe fuertemente.`
        )
        .setColor("Random")
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "pat") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("pat");

      if (!member)
        return interaction.reply({
          content: "No pude encontrar a esa persona en el servidor.",
          ephemeral: true
        });
      if (member.user.id === interaction.user.id)
        return interaction.reply({
          content:
            "No puedes darte una palmada a ti mismo, eso sería raro jeje.",
          ephemeral: true
        });

      embed
        .setDescription(
          `¡${bold(interaction.user.username)} le dio una palmadita a ${bold(member.user.username)}!`
        )
        .setColor("Random")
        .setImage(data.url);
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "slap") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("slap");

      if (!member)
        return interaction.reply({
          content: "No pude encontrar a esa persona en el servidor.",
          ephemeral: true
        });
      if (member.user.id === interaction.user.id)
        return interaction.reply({
          content: "¿Enserio quieres hacerte daño?",
          ephemeral: true
        });

      embed
        .setColor("Random")
        .setImage(data.url)
        .setDescription(
          `¡${bold(interaction.user.username)} le dio una bofetada a ${bold(member.user.username)}!`
        );
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "wave") {
      data = await fetchAnimeGIF("wave");
      embed
        .setDescription(
          `${bold(interaction.user.username)} está saludando a todos en el chat!`
        )
        .setColor("Random")
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "wink") {
      data = await fetchAnimeGIF("wink");

      const member = interaction.options.getMember("member") as GuildMember;

      if (!member)
        return interaction.reply({
          content: "No pude encontrar a esa persona en el servidor.",
          ephemeral: true
        });
      if (member.user.id === interaction.user.id)
        return interaction.reply({
          content:
            "No puedes guiñarte el ojo a ti mismo, eso sería muy raro jeje.",
          ephemeral: true
        });

      embed
        .setColor("Random")
        .setImage(data.url)
        .setDescription(
          `¡${bold(interaction.user.username)} le guiñó el ojo a ${bold(member.user.username)}!`
        );

      return interaction.reply({ embeds: [embed] });
    }

    return interaction.reply({
      content: "Haz uso de los diferentes subcomandos que tiene este comando.",
      ephemeral: true
    });
  }
});
