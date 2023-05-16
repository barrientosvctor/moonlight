import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";
import { IClashRoyaleItemsClanData, IClashRoyaleDeckData, IClashRoyalePlayerUpcomingChests, IClashRoyaleTournamentData, IClashRoyaleTournamentItemData } from "../../types/clashRoyale";
import { FetchClashRoyale } from "../../utils/functions/clashRoyale";

export default new CommandBuilder({
  name: "clashroyale",
  description: "Muestra información sobre el juego de Supercell Clash Royale.",
  cooldown: 3,
  aliases: ["clash", "cr"],
  usage: "??",
  example: "??",
  enabled: true,
  async run(bot, msg, args) {
    function dateFixed(date: string) {
      const tmp = [...date];
      const indexList = [4, 7];

      // -
      indexList.forEach((indexLine) => {
        tmp.splice(indexLine, 0, "-");
      });

      // :
      const indexList2 = [13, 16];
      indexList2.forEach((indexLine) => {
        tmp.splice(indexLine, 0, ":");
      });

      return tmp.join("");
    }
    const opts = [
      "player",
      "clan",
      "tournament"
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
    let data: any;

    switch (args[1]) {
      case opts[0]:
        if (!args[2] || !args[2].startsWith("#"))
          return msg.channel.send(
            bot.replyMessage(
              `escribe el tag de Clash Royale de algún jugador (poner # al inicio del tag).`,
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
        case opts[1]:
          if (!args[2])
          return msg.channel.send(
            bot.replyMessage(
              `escribe el nombre de algún clan de Clash Royale para buscar, o pon escribe el tag de un clan para obtener más información. (poner # al inicio del tag).`,
              { mention: msg.author.username, emoji: "noargs" }
            )
          );

          if (args[2].startsWith("#")) {
            data = await FetchClashRoyale(`https://api.clashroyale.com/v1/clans/${encodeURIComponent(args.slice(2).join(" "))}`);

            embed.setTitle("Clash Royale: Información del clan")
            embed.setDescription(`
**Nombre:** ${data.name}
**Descripción:** ${data.description || "Ninguno"}
**Tag:** ${data.tag}
**Tipo:** ${data.type}
**Localización:** ${data.location.name} (${data.location.countryCode})
**Copas requeridas:** ${data.requiredTrophies}
**Miembros:** ${data.members}

**Donaciones por semana:** ${data.donationsPerWeek}
**Estado de cofre del clan:** ${data.clanChestStatus}
**Nivel de cofre del clan:** ${data.clanChestLevel}
**Nivel máximo de cofre del clan:** ${data.clanChestMaxLevel}
`)
          } else {
            data = await FetchClashRoyale(`https://api.clashroyale.com/v1/clans?name=${encodeURIComponent(args.slice(2).join(" "))}&limit=10`);

            if (!data.items.length) return msg.reply(bot.replyMessage(`No encontré resultados con *${args.slice(2).join(" ")}*`, { emoji: "error" }));

            const clans = Array.from(data.items, (clan: IClashRoyaleItemsClanData) => `> **Nombre:** ${clan.name}\n> **Tipo**: ${clan.type}\n> **Tag:** ${clan.tag}\n> **Miembros:** ${clan.members}`);

            embed.setTitle("Clash Royale: Busqueda de Clanes")
            embed.setDescription(clans.join("\n\n"));
          }
          break;
          case opts[2]:
            if (!args[2]) return msg.channel.send(bot.replyMessage("escribe el nombre de algún torneo, o escribe su tag para obtener más información (recuerda poner # antes del tag)", { mention: msg.author.username, emoji: "noargs" }));

            if (args[2].startsWith("#")) {
          data = await FetchClashRoyale(`https://api.clashroyale.com/v1/tournaments/${encodeURIComponent(args[2])}`);

          if (data.reason === "notFound") return msg.channel.send(bot.replyMessage(`No pude encontrar un torneo con el tag *${args[2]}*`, { emoji: "error" }));

          const membersTournament = Array.from(data.membersList, (m: IClashRoyaleTournamentData) => `${m.name} (${m.tag})`);

          embed.setTitle("Clash Royale: Torneo")
          embed.setDescription(`
**Nombre:** ${data.name}
**Tag:* ${data.tag}
**Tipo:** ${data.type}
**Estado:** ${data.status}

**Capacidad:** ${data.capacity}
**Capacidad máxima:** ${data.maxCapacity}
**Fecha de creación:** <t:${Math.ceil(new Date(dateFixed(data.createdTime)).getTime() / 1000)}>
**Fecha de inicio:** <t:${Math.ceil(new Date(dateFixed(data.startedTime)).getTime() / 1000)}>

> Miembros (${data.membersList.length})
${membersTournament.join(", ") || "Ninguno"}
`)
        } else {
          data = await FetchClashRoyale(`https://api.clashroyale.com/v1/tournaments?name=${args.slice(2).join(" ")}&limit=10`);

          if (!data.items.length) return msg.channel.send(bot.replyMessage(`No encontré resultados de torneos con *${args.slice(2).join(" ")}*`, { emoji: "error" }));

          const tournaments = Array.from(data.items, (t: IClashRoyaleTournamentItemData) => `> **Nombre:** ${t.name}\n> **Tag:** ${t.tag}\n> **Tag del creador:** ${t.creatorTag}\n> **Tipo:** ${t.type}\n> **Capacidad:** ${t.capacity}\n> **Capacidad máxima:** ${t.maxCapacity}`);

          embed.setTitle("Clash Royale: Resultados de torneos")
          embed.setDescription(tournaments.join("\n\n"));
        }
    }

    return msg.reply({ embeds: [embed] });
  }
});
