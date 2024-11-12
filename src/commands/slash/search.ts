import { EmbedBuilder, SlashCommandBuilder, bold, hyperlink, time } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("search")
  .setDescription("Search commands.")
  .addSubcommand(cmd =>
    cmd
    .setName("github")
    .setDescription("Search the profile of a GitHub user.")
    .addStringOption(input =>
      input
      .setName("username")
      .setDescription("Type the username of a GitHub user.")
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(39)))
  .addSubcommand(cmd =>
    cmd
    .setName("npm")
    .setDescription("Search information about a NPM package.")
    .addStringOption(input =>
      input
      .setName("package")
      .setDescription("Type the name of a NPM package.")
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(214)))
  .addSubcommand(cmd =>
    cmd
    .setName("steam")
    .setDescription("Search information about a Steam game.")
    .addStringOption(input =>
      input
      .setName("game")
      .setDescription("Type the game's name.")
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(510)))
  .addSubcommand(cmd =>
    cmd
    .setName("weather")
    .setDescription("Search information about a country's weather.")
    .addStringOption(input =>
      input
      .setName("country")
      .setDescription("Type the country's name.")
      .setRequired(true)
      .setMinLength(1)
      .setMaxLength(255))),
  testGuildOnly: true,
  async run(interaction, _) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "github") {
      const githubUsername = interaction.options.getString("username", true);
      const data = await fetch(`https://api.github.com/users/${githubUsername}`, {
        method: "GET"
      });
      const json = await data.json();
      if (data.status === 404) return interaction.reply(`El usuario ${bold(githubUsername)} no existe en GitHub.`);

      const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(json.login)
      .setThumbnail(json.avatar_url)
      .setDescription(`
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
    }

    return interaction.reply("Haz uso de los diferentes subcomandos que trae éste comando.");
  },
});
