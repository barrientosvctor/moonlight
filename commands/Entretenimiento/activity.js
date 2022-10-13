let Command = require('../../base/models/Command'),
discord = require('discord.js'),
fetch = require('node-fetch').default;
module.exports = new Command({
    name: 'activity',
    description: 'Crea actividades para canales de voz.',
    cooldown: 3,
    aliases: ['activities'],
    category: 'Entretenimiento',
    usage: '<actividad>',
    example: 'youtube',
    enabled: true,
    botPerms: ['CreateInstantInvite'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            const opts = ['youtube', 'poker', 'betrayal', 'fishing', 'chess', 'lettertile', 'wordsnack', 'doodlecrew', 'awkword', 'spellcast', 'checkers', 'puttparty', 'sketchheads', 'ocho', 'land', 'meme', 'askaway', 'bobble'];
            const defaultApplications = {
		youtube: '880218394199220334', // Note : First package to include the new YouTube Together version, any other package offering it will be clearly inspired by it
		youtubedev: '880218832743055411', // Note : First package to include the new YouTube Together development version, any other package offering it will be clearly inspired by it
		poker: '755827207812677713',
		betrayal: '773336526917861400',
		fishing: '814288819477020702',
		chess: '832012774040141894',
		chessdev: '832012586023256104', // Note : First package to offer chessDev, any other package offering it will be clearly inspired by it
		lettertile: '879863686565621790', // Note : First package to offer lettertile, any other package offering it will be clearly inspired by it
		wordsnack: '879863976006127627', // Note : First package to offer wordsnack any other package offering it will be clearly inspired by it
		doodlecrew: '878067389634314250', // Note : First package to offer doodlecrew, any other package offering it will be clearly inspired by it
		awkword: '879863881349087252', // Note : First package to offer awkword, any other package offering it will be clearly inspired by it
		spellcast: '852509694341283871', // Note : First package to offer spellcast, any other package offering it will be clearly inspired by it
		checkers: '832013003968348200', // Note : First package to offer checkers, any other package offering it will be clearly inspired by it
		puttparty: '763133495793942528', // Note : First package to offer puttparty, any other package offering it will be clearly inspired by it
		sketchheads: '902271654783242291', // Note : First package to offer sketchheads any other package offering it will be clearly inspired by it
		ocho: '832025144389533716', // Note : First package to offer ocho any other package offering it will be clearly inspired by it
		puttpartyqa: '945748195256979606', // Unavailable
		sketchyartist: '879864070101172255', // Note : First package to offer sketchyartist, any other package offering it will be clearly inspired by it
		land: '903769130790969345',
		meme: '950505761862189096',
		askaway: '976052223358406656',
		bobble: '947957217959759964',
            }
      if(!msg.member.voice.channel) return msg.channel.send(`**${msg.author.username}**, debes de unirte a un canal de voz para usar este comando.`);
      else if(!args[1]) return msg.channel.send(`**${msg.author.username}**, especifica una actividad.\n**Actividades disponibles:** ${opts.join(', ')}`);
      else if(!opts.includes(args[1])) return msg.channel.send(`${bot.getEmoji('error')} - Argumento no válido.\n**Actividades disponibles:** ${opts.join(', ')}`);
      else if(['bobble', 'poker', 'puttparty', 'land', 'chess', 'spellcast', 'lettertile', 'checkers'].includes(args[1].toLowerCase()) && (msg.guild.premiumTier !== discord.GuildPremiumTier.Tier1 || msg.guild.premiumTier !== discord.GuildPremiumTier.Tier2 || msg.guild.premiumTier !== discord.GuildPremiumTier.Tier3)) return msg.reply(`${bot.getEmoji('error')} No puedes jugar \`${args[1].toLowerCase()}\` debido a que el servidor debe ser mayor o igual a nivel 1 en boost.`);
      else {
        try {
          await fetch(`https://discord.com/api/v10/channels/${msg.member.voice.channelId}/invites`, {
            method: 'POST',
            body: JSON.stringify({
              max_age: 86400,
              max_uses: 0,
              target_application_id: defaultApplications[args[1].toLowerCase()],
              target_type: 2,
              temporary: false,
              validate: null,
            }),
            headers: {
              Authorization: `Bot ${process.env.login}`,
              'Content-Type': 'application/json',
            },
          }).then(res => res.json()).then(invite => {
            if(invite.error || !invite.code) return msg.reply(`${bot.getEmoji('error')} - Ocurrió un error mientras obtenia los datos!`);
            if(Number(invite.code) === 50013) return msg.reply(`${bot.getEmoji('error')} - Moonlight carece de permisos para realizar esa acción.`);
            if(Number(invite.code) === 50035) return msg.reply(`${bot.getEmoji('error')} - Moonlight no es capaz de crear una invitación hacía este juego.`);
            return msg.channel.send(`${bot.getEmoji('check')} - La actividad ha sido creado con éxito.\n> https://discord.com/invite/${invite.code}`);
          });
        } catch (error) {
          msg.channel.send(`Un error ocurrió mientras se iniciaba la actividad.`);
          console.error(error);
        }
      }
        } catch (err) {
            bot.err('Hubo un error al intentar crear la actividad.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
        }
    }
});
