let Command = require('../../base/models/Command'),
discord = require('discord.js');
module.exports = new Command({
    name: 'activity',
    description: 'Crea actividades para canales de voz.',
    cooldown: 3,
    aliases: ['activities'],
    category: 'Entretenimiento',
    usage: '<actividad>',
    example: 'youtube',
    enabled: true,
    botPerms: ['CREATE_INSTANT_INVITE'],
    dirname: __dirname,
    filename: __filename,
    async run(bot, msg, args) {
        try {
            const opts = ['youtube', 'poker', 'betrayal', 'fishing', 'chess', 'lettertile', 'wordsnack', 'doodlecrew', 'awkword', 'spellcast', 'checkers', 'puttparty', 'sketchheads', 'ocho'];
            const defaultApplications = {
                youtube: '880218394199220334',
                youtubedev: '880218832743055411',
                poker: '755827207812677713',
                betrayal: '773336526917861400',
                fishing: '814288819477020702',
                chess: '832012774040141894',
                chessdev: '832012586023256104',
                lettertile: '879863686565621790',
                wordsnack: '879863976006127627',
                doodlecrew: '878067389634314250',
                awkword: '879863881349087252',
                spellcast: '852509694341283871',
                checkers: '832013003968348200',
                puttparty: '763133495793942528',
                sketchheads: '902271654783242291',
                ocho: '832025144389533716',
            };
      if(!msg.member.voice.channel) return msg.channel.send(`**${msg.author.username}**, debes de unirte a un canal de voz para usar este comando.`);
      else if(!args[1]) return msg.channel.send(`**${msg.author.username}**, especifica una actividad.\n**Actividades disponibles:** ${opts.join(', ')}`);
      else if(!opts.includes(args[1])) return msg.channel.send(`${bot.config.emojis.error} - Argumento no válido.\n**Actividades disponibles:** ${opts.join(', ')}`);
      else {
        try {
          await fetch(`https://discord.com/api/v8/channels/${msg.member.voice.channelId}/invites`, {
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
              Authorization: `Bot ${process.env.token}`,
              'Content-Type': 'application/json',
            },
          }).then(res => res.json()).then(invite => {
            if(invite.error || !invite.code) return msg.reply(`${bot.config.emojis.error} - Ocurrió un error mientras obtenia los datos!`);
            if(Number(invite.code) === 50013) return msg.reply(`${bot.config.emojis.error} - Moonlight carece de permisos para realizar esa acción.`);
            return msg.channel.send(`${bot.config.emojis.check} - La actividad ha sido creado con éxito.\n> https://discord.com/invite/${invite.code}`);
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
