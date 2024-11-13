import { EmbedBuilder, GuildMember, SlashCommandBuilder, bold } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";
import { type AnimeProviderResponse, fetchAnimeGIF } from "../../util/functions.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("reaction")
  .setDescription("Reaction commands.")
  .addSubcommand(cmd =>
    cmd
    .setName("bite")
    .setDescription("Bite a member.")
    .addUserOption(user =>
      user
      .setName("member")
      .setDescription("Choose the member to bite.")
      .setRequired(true)))
  .addSubcommand(cmd =>
    cmd
    .setName("cry")
    .setDescription("Just cry."))
  .addSubcommand(cmd =>
    cmd
    .setName("dance")
    .setDescription("Dance to express your happiness."))
  .addSubcommand(cmd =>
    cmd
    .setName("facepalm")
    .setDescription("Facepalm."))
  .addSubcommand(cmd =>
    cmd
    .setName("happy")
    .setDescription("You are happy!"))
  .addSubcommand(cmd =>
    cmd
    .setName("hug")
    .setDescription("Hug a member.")
    .addUserOption(user =>
      user
      .setName("member")
      .setDescription("Choose a member to hug.")
      .setRequired(true)))
  .addSubcommand(cmd =>
    cmd
    .setName("kiss")
    .setDescription("Kiss a member.")
    .addUserOption(user =>
      user
      .setName("member")
      .setDescription("Choose a member to kiss.")
      .setRequired(true)))
  .addSubcommand(cmd =>
    cmd
    .setName("laugh")
    .setDescription("You are laughing!"))
  .addSubcommand(cmd =>
    cmd
    .setName("pat")
    .setDescription("Give a pat to a member.")
    .addUserOption(user =>
      user
      .setName("member")
      .setDescription("Choose a member to pat.")
      .setRequired(true)))
  .addSubcommand(cmd =>
    cmd
    .setName("slap")
    .setDescription("Slap a member.")
    .addUserOption(user =>
      user
      .setName("member")
      .setDescription("Choose a member to slap.")
      .setRequired(true)))
  .addSubcommand(cmd =>
    cmd
    .setName("wave")
    .setDescription("Wave to everyone at chat!"))
  .addSubcommand(cmd =>
    cmd
    .setName("wink")
    .setDescription("Wink a member.")
    .addUserOption(user =>
      user
      .setName("member")
      .setDescription("Choose a member to wink.")
      .setRequired(true))),
  testGuildOnly: true,
  async run(interaction) {
    const subcommand = interaction.options.getSubcommand();
    let data: AnimeProviderResponse;
    if (subcommand === "bite") {
      const member = interaction.options.getMember("member") as GuildMember;

      if (!member) return interaction.reply("Este usuario no está en el servidor.");
      if (member.user.id === interaction.user.id)
        return interaction.reply({ content: "¿Por qué te morderías a ti mismo?", ephemeral: true });

      data = await fetchAnimeGIF("bite");
      const embed = new EmbedBuilder()
      .setDescription(`${bold(interaction.user.username)} modió a ${bold(member.user.username)}.`)
      .setColor("Random")
      .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "cry") {
      data = await fetchAnimeGIF("cry");
      const embed = new EmbedBuilder()
      .setDescription(`${bold(interaction.user.username)} está llorando.`)
      .setColor("DarkGrey")
      .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "dance") {
      data = await fetchAnimeGIF("dance");
      const embed = new EmbedBuilder()
      .setColor("Random")
      .setImage(data.url)
      .setDescription(`${bold(interaction.user.username)} está bailando.`);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "facepalm") {
      data = await fetchAnimeGIF("facepalm");
      const embed = new EmbedBuilder()
      .setDescription(`${bold(interaction.user.username)} está decepcionado.`)
      .setColor("DarkGrey")
      .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "happy") {
      data = await fetchAnimeGIF("happy");
      const embed = new EmbedBuilder()
      .setDescription(`${bold(interaction.user.username)} está feliz! :D`)
      .setColor("Random")
      .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "hug") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("hug");
      const embed = new EmbedBuilder();

      if (!member)
        return interaction.reply({ content: "No pude encontrar a esa persona en el servidor.", ephemeral: true });
      if (member.user.id === interaction.user.id)
        return interaction.reply({ content: "No puedes abrazarte a ti mismo, eso sería muy raro jeje.", ephemeral: true });

      embed
        .setColor("Random")
        .setDescription(`¡${bold(interaction.user.username)} le dió un fuerte abrazo a ${bold(member.user.username)}!`)
        .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "kiss") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("kiss");
      const embed = new EmbedBuilder();

      if (!member)
        return interaction.reply({ content: "No pude encontrar a esa persona en el servidor.", ephemeral: true });
      if (member.user.id === interaction.user.id)
        return interaction.reply({ content: "No puedes besarte a ti mismo, eso sería muy raro jeje.", ephemeral: true });

      embed
        .setImage(data.url)
        .setColor("Random")
        .setDescription(`¡${bold(interaction.user.username)} le dio un beso a ${bold(member.user.username)}!`);
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "laugh") {
      data = await fetchAnimeGIF("laugh");
      const embed = new EmbedBuilder()
      .setDescription(`${bold(interaction.user.username)} se ríe fuertemente.`)
      .setColor("Random")
      .setImage(data.url);

      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "pat") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("pat");
      const embed = new EmbedBuilder();

      if (!member)
        return interaction.reply({ content: "No pude encontrar a esa persona en el servidor.", ephemeral: true });
      if (member.user.id === interaction.user.id)
        return interaction.reply({ content: "No puedes darte una palmada a ti mismo, eso sería raro jeje.", ephemeral: true });

      embed
        .setDescription(`¡${bold(interaction.user.username)} le dio una palmadita a ${bold(member.user.username)}!`)
        .setColor("Random")
        .setImage(data.url);
      return interaction.reply({ embeds: [embed] });
    } else if (subcommand === "slap") {
      const member = interaction.options.getMember("member") as GuildMember;
      data = await fetchAnimeGIF("slap");
      const embed = new EmbedBuilder();

      if (!member)
        return interaction.reply({ content: "No pude encontrar a esa persona en el servidor.", ephemeral: true });
      if (member.user.id === interaction.user.id)
        return interaction.reply({ content: "¿Enserio quieres hacerte daño?", ephemeral: true });

      embed
        .setColor("Random")
        .setImage(data.url)
        .setDescription(`¡${bold(interaction.user.username)} le dio una bofetada a ${bold(member.user.username)}!`);
      return interaction.reply({ embeds: [embed] });
    }

    return interaction.reply({ content: "Haz uso de los diferentes subcomandos que tiene este comando.", ephemeral: true });
  },
});
