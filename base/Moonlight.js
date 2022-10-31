let discord = require('discord.js'),
fs = require('fs'),
database = require('./packages/database');

module.exports = class bot extends discord.Client {
    constructor() {
        super({ intents: 34767, allowedMentions: { repliedUser: false, parse: ['users'] }, partials: [discord.Partials.User, discord.Partials.Channel, discord.Partials.Message, discord.Partials.GuildMember] });
        this.cmds = new discord.Collection();
        this.aliases = new discord.Collection();
        this.snipes = new discord.Collection();
        this.bl_url = ['whatismyip.com', 'bit.ly', 'adf.ly', 'is.gd', 'tinyurl.com', 'iplogger.com', 'discords.gift', 'discord.gift', 'whatsmyip.com', 'whatsmyip.org', 'whatismyipaddress.com'];
        this.nsfw_url = ['pornhub.com', 'nhentai.to', 'hentaila.com', 'hentaihaven.xxx', 'rule34.xxx', 'xvideos.com', 'xnxx.com', 'chochox.com', '4tube.com', 'goku.com', 'porn.com', 'nhentai.xxx', 'nhentai.io', 'nhentai.net'];
        this.logs = new discord.WebhookClient({ id: process.env.logs_id, token: process.env.logs_token });
        this.utils = require('./others/utils');
    }
    init() {
      ['command', 'event', 'errors'].forEach(handler => require(`./handlers/${handler}`)(this));
      this.login(process.env.login);
    }

    async getPrefix(guild) {
        const db = new database('./databases/prefix.json');
        let prefix;
        if(db.has(`${guild}`)) prefix = await db.get(guild);
        else prefix = '!!';
        return prefix;
    }
    /**
     * @param {String} message
     * @typedef {{ name: string, type: string, filename: string, channel: discord.TextChannel, error: Error }} DataOptions
     * @param {DataOptions} data
     */
    err(message, data) {
      //bot.err('Contenido del mensaje.', { name: this.name, type: 'command', filename: __filename, channel: msg.channel, error: err });
      if(!data.name) throw new Error('No se puede enviar un error sin el dato "name".');
      if(!data.type) throw new Error('No se puede enviar un error sin el dato "type".');
      if(!data.filename) throw new Error('No se puede enviar un error sin el dato "filename".');
      if(!data.error) throw new Error('No se puede enviar un error sin el dato "error".');
      if(typeof data.type !== 'string') throw new TypeError(data.filename + ': El tipo de dato "type" debe ser un string.');
      let embed = new discord.EmbedBuilder();
      embed.setDescription(`\`\`\`\n${data.error}\n\`\`\``);
      if(data.type === 'command') {
        if(!message) throw new Error('No se puede enviar un error en un comando sin el dato "message"');
        if(typeof message !== 'string') throw new TypeError('El tipo de dato "message" debe ser un string.');
        embed.setTitle(`\`comando\` - Error en \`${data.name}\``);
      } else if(data.type === 'event') {
        embed.setTitle(`\`evento\` - Error en \`${data.name}\``);
      } else throw new TypeError(data.filename + ': El tipo de dato "type" debe ser "command" o "event".');
      this.logs.send({ embeds: [embed] });
      console.error(data.error);
      data.channel.send(`${this.getEmoji('error')} ${message}`);
    }
    /** @param {String} name */
    reloadCommand(name) {
      let command;
      if(this.cmds.has(name)) command = this.cmds.get(name);
      else if(this.aliases.has(name)) command = this.cmds.get(this.aliases.get(name));
      else throw new Error(`El comando \`${name}\` no existe.`);
      let pull = require(command.filename);
      delete require.cache[require.resolve(command.filename)];
      this.cmds.delete(name);
      this.cmds.set(name, pull);
    }
    reloadAllCommands() {
      fs.readdirSync('./commands/').forEach(sc => {
        fs.readdirSync(`./commands/${sc}/`).filter(f => f.endsWith('.js')).forEach(file => {
          let cmd = require(`../commands/${sc}/${file}`);
          delete require.cache[require.resolve(`../commands/${sc}/${file}`)];
          this.cmds.set(cmd.name, cmd);
        });
      });
    }
    /** @param {String} type */
    getEmoji(type) {
      if(typeof type !== 'string') throw new TypeError('El tipo de emoji debe ser un string.');
      let emoji;
      if(type === 'check') emoji = ['✅'];
      else if(type === 'error') emoji = ['❌'];
      else if(type === 'noargs') emoji = ['❓'];
      else if(type === 'sad') emoji = ['😢'];
      else if(type === 'love') emoji = ['❤'];
      else if(type === 'warning') emoji = ['⚠️'];
      else if(type === 'waiting') emoji = [];
      else if(type === 'party') emoji = ['🎉'];
      if(typeof emoji === 'object') {
        return emoji[Math.floor(Math.random() * emoji.length)];
      } else {
        return emoji;
      }
    }
    /**
     * @param {String} player1
     * @param {String} player2
     */
    rps(player1, player2) {
      if(player1 === player2) return `${player1} vs. ${player2}\n**¡Empate!**`;

      let results = {
        piedra: {
          tijera: true,
          papel: false
        },
        papel: {
          piedra: true,
          tijera: false
        },
        tijera: {
          papel: true,
          piedra: false
        }
      }
      if(results[player1][player2]) return `${player1} vs. ${player2}\n**¡Ganaste!**`;
      else return `${player1} vs. ${player2}\n**¡Ganó ${this.user.username}!**`;
    }
    /** @param {Number} number */
    shipPercentage(number) {
      if(typeof number !== 'number') throw new TypeError('El tipo de dato "number" debe ser un número.');
      if(number < 0) throw new RangeError('El número debe ser mayor o igual a 0.');
      if(number > 100) throw new RangeError('El número debe ser menor o igual a 100.');
      
      if(number >= 1 && number <= 10) return `Se llevan súper mal.\n\n🟥⬛⬛⬛⬛⬛⬛⬛⬛⬛`;
      else if(number >= 11 && number <= 20) return `Apenas y se soportan.\n\n🟥🟥⬛⬛⬛⬛⬛⬛⬛⬛`;
      else if(number >= 21 && number <= 30) return `Parece que no son lo suyo.\n\n🟥🟥🟥⬛⬛⬛⬛⬛⬛⬛`;
      else if(number >= 31 && number <= 40) return `Podría no funcionar.\n\n🟥🟥🟥🟥⬛⬛⬛⬛⬛⬛`;
      else if(number >= 41 && number <= 50) return `Hmmm.\n\n🟥🟥🟥🟥🟥⬛⬛⬛⬛⬛`;
      else if(number >= 51 && number <= 60) return `Punto medio.\n\n🟥🟥🟥🟥🟥🟥⬛⬛⬛⬛`;
      else if(number >= 61 && number <= 70) return `Puede haber algo entre ellos...\n\n🟥🟥🟥🟥🟥🟥🟥⬛⬛⬛`;
      else if(number >= 71 && number <= 80) return `👀\n\n🟥🟥🟥🟥🟥🟥🟥🟥⬛⬛`;
      else if(number >= 81 && number <= 90) return `❤️\n\n🟥🟥🟥🟥🟥🟥🟥🟥🟥⬛`;
      else if(number >= 91 && number <= 100) return `💓\n\n🟥🟥🟥🟥🟥🟥🟥🟥🟥🟥`;
      else return `No hay nada que hacer.\n\n⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛`;
    }
}
