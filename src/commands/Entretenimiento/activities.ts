import { GuildPremiumTier } from "discord.js";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
  name: "activities",
  description: "Crea actividades para canales de voz.",
  cooldown: 3,
  aliases: ["activity"],
  usage: "<actividad>",
  example: "youtube",
  enabled: true,
  async run(bot, msg, args) {
    try {
      const opts = ["youtube", "poker", "betrayal", "fishing", "chess", "lettertile", "wordsnack", "doodlecrew", "awkword", "spellcast", "checkers", "puttparty", "sketchheads", "ocho", "land", "meme", "askaway", "bobble"];
      if (!args[1]) return msg.channel.send(bot.replyMessage(`especifica alguna actividad para iniciar.\n> **Todas las actividades:** ${new Intl.ListFormat("es-ES").format(opts)}`, { mention: msg.author.username, emoji: "noargs" }));

      const defaultApplications = {
        youtube: "880218394199220334", // Note : First package to include the new YouTube Together version, any other package offering it will be clearly inspired by it
        youtubedev: "880218832743055411", // Note : First package to include the new YouTube Together version, any other package offering it will be clearly inspired by it
        poker: "755827207812677713",
        betrayal: "773336526917861400",
        fishing: "814288819477020702",
        chess: "832012774040141894",
        chessdev: "832012586023256104", // Note : First package to offer chessDev, any other package offering it will be clearly inspired by it
        lettertile: "879863686565621790", // Note : First package to offer lettertile, any other package offering it will be clearly inspired by it
        wordsnack: "879863976006127627", // Note : First package to offer wordsnack any other package offering it will be clearly inspired by it
        doodlecrew: "878067389634314250", // Note : First package to offer doodlecrew, any other package offering it will be clearly inspired by it
        awkword: "879863881349087252", // Note : First package to offer awkword, any other package offering it will be clearly inspired by it
        spellcast: "852509694341283871", // Note : First package to offer spellcast, any other package offering it will be clearly inspired by it
        checkers: "832013003968348200", // Note : First package to offer checkers, any other package offering it will be clearly inspired by it
        puttparty: "763133495793942528", // Note : First package to offer puttparty, any other package offering it will be clearly inspired by it
        sketchheads: "902271654783242291", // Note : First package to offer sketchheads any other package offering it will be clearly inspired by it
        ocho: "832025144389533716", // Note : First package to offer ocho any other package offering it will be clearly inspired by it
        puttpartyqa: "945748195256979606", // Unavailable
        sketchyartist: "879864070101172255", // Note : First package to offer sketchyartist, any other package offering it will be clearly inspired by it
        land: "903769130790969345",
        meme: "950505761862189096",
        askaway: "976052223358406656",
        bobble: "947957217959759964",
      }

      if (!msg.member?.voice.channel) return msg.reply(bot.replyMessage("Debes de unirte a un canal de voz para empezar a crear actividades.", { emoji: "error" }));
      if (!opts.includes(args[1])) return msg.reply(bot.replyMessage(`Actividad no válida.\n> **Todas las actividades:** ${new Intl.ListFormat("es-ES").format(opts)}`, { emoji: "error" }));
      if (["bobble", "poker", "puttparty", "land", "chess", "spellcast", "lettertile", "checkers"].includes(args[1].toLowerCase()) && (msg.guild?.premiumTier === GuildPremiumTier.None)) return msg.reply(bot.replyMessage(`No puedes jugar \`${args[1].toLowerCase()}\` debido a que el servidor debe ser mayor o igual a nivel 1 en boost.`, { emoji: "error" }));

      await fetch(`https://discord.com/api/v10/channels/${msg.member.voice.channel.id}/invites`, {
        method: "post",
        body: JSON.stringify({
          max_age: 86400,
          max_uses: 0,
          target_application_id: defaultApplications[args[1].toLowerCase()],
          target_type: 2,
          temporary: false,
          validate: null,
        }),
        headers: {
          Authorization: `Bot ${process.env.BOT_TOKEN}`,
          "Content-Type": "application/json"
        }
      }).then(res => res.json()).then(invite => {
        if (invite.error || !invite.code) return msg.reply(bot.replyMessage("Ocurrió un error mientras obtenia los datos!", { emoji: "error" }));
        if (Number(invite.code) === 50013) return msg.reply(bot.replyMessage("Moonlight carece de permisos para realizar esa acción.", { emoji: "warning" }));
        if (Number(invite.code) === 50035) return msg.reply(bot.replyMessage("Moonlight no es capaz de crear una invitación hacía este juego.", { emoji: "error" }));
        return msg.channel.send(bot.replyMessage(`La actividad ha sido creado con éxito.\n> https://discord.com/invite/${invite.code}`, { emoji: "check" }));
      }).catch(error => {
        msg.channel.send("Ocurrió un error al intentar crear la actividad.");
        console.error(error);
      });
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
