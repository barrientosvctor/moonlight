import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";
import { IClashRoyaleDeckData, IClashRoyalePlayerUpcomingChests } from "../../types/clashRoyale";
import { FetchClashRoyale } from "../../utils/functions/clashRoyale";

export default new CommandBuilder({
  name: "clashroyale",
  description: "Muestra información sobre el juego de Supercell Clash Royale.",
  cooldown: 3,
  aliases: ["clash", "cr"],
  usage: "??",
  example: "??",
  enabled: true,
  ownerOnly: true,
  async run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole) {
    const opts = [
      "player",
      "clan",
      "card",
      "tournament",
      "location",
      "challenge"
    ];

    if (!args[1] || !opts.includes(args[1]))
      return msg.channel.send(
        bot.replyMessage(
          `especifica alguno de los siguientes subcomandos: *${opts.join(
            ", "
          )}*`,
          { mention: msg.author.username, emoji: "noargs" }
        )
      );

    let embed = new MoonlightEmbedBuilder(msg.author, msg.guild);
    let data;

    switch (args[1]) {
      case opts[0]:
        if (!args[2] || !args[2].startsWith("#"))
          return msg.channel.send(
            bot.replyMessage(
              `escribe el ID de Clash Royale de algún jugador (poner # al inicio de la ID).`,
              { mention: msg.author.username, emoji: "noargs" }
            )
          );

        data = await FetchClashRoyale(`https://api.clashroyale.com/v1/players/${encodeURIComponent(args[2])}`);

        if (!data || data.reason === "notFound") return msg.reply(bot.replyMessage("No se encontró resultados.", { emoji: "error" }));

        const upcomingChestsData = await FetchClashRoyale(`https://api.clashroyale.com/v1/players/${encodeURIComponent(args[2])}/upcomingchests`);

        function getPlayerCurrentDeck() {
          const deckResult: string[] = data.currentDeck.map((card: IClashRoyaleDeckData) => {
            return `[${card.name}](${card.iconUrls.medium})`;
          });

          return deckResult;
        }

        function getPlayerUpcomingChests() {
          return Array.from(upcomingChestsData.items, (chest: IClashRoyalePlayerUpcomingChests) => chest.name);
        }

        embed.setTitle(`Clash Royale: ${data.name}`)
        embed.setDescription(`
**Tag:** ${data.tag}
**Nombre:** ${data.name}
**Nivel de experiencia:** ${data.expLevel}
**Copas:** ${data.trophies ?? 0}
**Arena:** ${data.arena.name || "No disponible"}
**Cartas:** ${data.cards.length}
**Insignias:** ${data.badges.length}
**Logros:** ${data.achievements.length}
**Mazo actual:** ${getPlayerCurrentDeck().join(", ") || "No disponible"}
**Próximos cofres:** ${getPlayerUpcomingChests().join(" -> ") || "No disponible"}

> __Estadisticas__
**Victorias:** ${data.wins ?? 0}
**Derrotas:** ${data.losses ?? 0}
**Contador de batallas:** ${data.battleCount || 0}
**Victorias con tres coronas:** ${data.threeCrownWins || 0}
**Contador de batallas de torneos:** ${data.tournamentBattleCount || 0}

**Clan:** ${data.clan ? `${data.clan.name} (${data.clan.tag})` : "Ninguno"}
**Cartas de clan recolectadas:** ${data.clanCardsCollected || 0}
**Donaciones hechas:** ${data.donations || 0}
**Donaciones recibidas:** ${data.donationsReceived || 0}
**Donaciones en total:** ${data.totalDonations || 0}

**Copas en la temporada actual:** ${data.leagueStatistics.currentSeason.trophies}
**Copas en la temporada anterior:** ${data.leagueStatistics.previousSeason.trophies}
**Rango en la temporada anterior:** ${data.leagueStatistics.previousSeason.rank}
`);
        break;
    }

    return msg.reply({ embeds: [embed] });
  }
});
