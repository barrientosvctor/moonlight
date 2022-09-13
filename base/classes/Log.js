let database = require('../../base/packages/database');
const bot = require('../Moonlight');

module.exports = class Log {
    /**
     * 
     * @param {String} key 
     * @param {Number} id
     */
    constructor(key, id) {
        this.key = key;
        this.id = id;
    }
    loadLog(embed) {
        if(!msg.guild.channels.cache.get(this.id)) return;
        bot.channels.cache.get(this.id).send({ embeds: [embed] });
    }
}