import {
  EmbedBuilder,
  SlashCommandBuilder,
  bold,
  hyperlink,
  time,
  underline
} from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
    .setName("search")
    .setDescription("Search commands.")
    .setDescriptionLocalizations({
      "es-ES": "Comandos de busqueda."
    })
    .addSubcommand(cmd =>
      cmd
        .setName("github")
        .setDescription("Search the profile of a GitHub user.")
        .setDescriptionLocalizations({
          "es-ES": "Busca el perfil de un usuario de GitHub."
        })
        .addStringOption(input =>
          input
            .setName("username")
            .setDescription("Type the username of a GitHub user.")
            .setDescriptionLocalizations({
              "es-ES": "Escribe el nombre de usuario de un usuario de GitHub."
            })
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(39)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("npm")
        .setDescription("Search information about a NPM package.")
        .setDescriptionLocalizations({
          "es-ES": "Busca información sobre un paquete NPM."
        })
        .addStringOption(input =>
          input
            .setName("package")
            .setDescription("Type the name of a NPM package.")
            .setDescriptionLocalizations({
              "es-ES": "Escribe el nombre de un paquete NPM."
            })
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(214)
        )
    )
    .addSubcommand(cmd =>
      cmd
        .setName("weather")
        .setDescription("Search information about a location's weather.")
        .setDescriptionLocalizations({
          "es-ES": "Busca información sobre el clima de una ubicación."
        })
        .addStringOption(input =>
          input
            .setName("location")
            .setDescription("Type the location's name.")
            .setDescriptionLocalizations({
              "es-ES": "Escribe el nombre de la ubicación."
            })
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(255)
        )
    ),
  testGuildOnly: true,
  async run(interaction, _) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "github") {
      const githubUsername = interaction.options.getString("username", true);
      const data = await fetch(
        `https://api.github.com/users/${githubUsername}`,
        {
          method: "GET"
        }
      );
      const json = await data.json();
      if (data.status === 404)
        return interaction.reply({
          content: `El usuario ${bold(githubUsername)} no existe en GitHub.`,
          ephemeral: true
        });

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(json.login)
        .setThumbnail(json.avatar_url).setDescription(`
> __Información general__
${bold("Nombre de usuario")}: ${json.login}
${bold("Nombre")}: ${json.name ? json.name : "No tiene nombre."}
${bold("Biografía")}: ${json.bio ? json.bio : "No tiene descripción."}
${bold("Email público")}: ${json.email ? json.email : "No tiene email público."}
${bold("Localidad")}: ${json.location ? json.location : "No tiene ubicación."}
${bold("Compañia")}: ${json.company ? json.company : "No tiene compañia."}
${bold("Twitter")}: ${json.twitter_username ? `[Perfil](https://twitter.com/${json.twitter_username})` : "No tiene perfil de Twitter."}
${bold("Fecha de creación")}: ${time(Math.ceil(new Date(json.created_at).getTime() / 1000))}
${bold("Última actualización")}: ${time(Math.ceil(new Date(json.updated_at).getTime() / 1000), "R")}

> __Links__
${hyperlink("Avatar", json.avatar_url)}
${hyperlink("Perfil", json.html_url)}
${hyperlink("Seguidores", `https://github.com/${json.login}?tab=followers`)} (${json.followers})
${hyperlink("Siguiendo", `https://github.com/${json.login}?tab=following`)} (${json.following})
${hyperlink("Repositorios", `https://github.com/${json.login}?tab=repositories`)} (${json.public_repos})
${hyperlink("Proyectos", `https://github.com/${json.login}?tab=projects`)}
${hyperlink("Paquetes", `https://github.com/${json.login}?tab=packages`)}`);
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "npm") {
      const packageName = interaction.options.getString("package", true);
      const data = await fetch(`https://api.popcat.xyz/npm?q=${packageName}`, {
        method: "GET"
      }).then(res => res.json());
      if (data.error)
        return interaction.reply({
          content: `El paquete ${bold(packageName)} no existe.`,
          ephemeral: true
        });

      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Nombre: ${data.name}`).setDescription(`
${bold("Descripción")}: ${data.description}
${bold("Versión")}: ${data.version}
${bold("Palabras clave")}: ${data.keywords}
${bold("Autor")}: ${data.author} (${data.author_email})
${bold("Última publicación")}: ${data.last_published}
${bold("Mantenedores")}: ${data.maintainers}
${bold("Repositorio")}: ${data.repository}
${bold("Descargas este año")}: ${data.downloads_this_year}`);
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "weather") {
      const locationName = interaction.options.getString("location", true);
      const data = await fetch(
        `https://api.popcat.xyz/weather?q=${encodeURIComponent(locationName)}`
      );

      if (
        data.headers.get("content-length") !== null &&
        data.headers.get("content-length") == "0"
      )
        return interaction.reply({
          content: "No pude encontrar ésta ubicación.",
          ephemeral: true
        });

      const json = await data.json();
      const embed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${json[0].location.name}`)
        .setDescription(
          `
> ${underline("Pronóstico del clima")}
${bold("Cielo")}: ${json[0].current.skytext}
${bold("Temperatura")}: ${json[0].current.temperature}°${json[0].location.degreetype}
${bold("Sensación térmica")}: ${json[0].current.feelslike}°${json[0].location.degreetype}
${bold("Humedad")}: ${json[0].current.humidity}%
${bold("Velocidad del viento")}: ${json[0].current.winddisplay}

> ${underline("Otra información")}
${bold("Día")}: ${json[0].current.day} (${json[0].current.shortday})
${bold("Fecha y hora")}: ${json[0].current.date} - ${json[0].current.observationtime}
${bold("Zona horaria")}: GMT${json[0].location.timezone}`
        )
        .setThumbnail(json[0].current.imageUrl);
      return interaction.reply({ embeds: [embed] });
    }

    return interaction.reply({
      content: "Haz uso de los diferentes subcomandos que trae éste comando.",
      ephemeral: true
    });
  }
});
