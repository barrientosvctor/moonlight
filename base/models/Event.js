let discord = require('discord.js'),
Moonlight = require('../Moonlight');

/** 
* @param {Moonlight} bot
* @param {any[]} ...args
*/
function runEvent(bot, ...args) {}

module.exports = class Event {
    /**
    * @typedef {{name: discord.ClientEvents, once: boolean, run: runEvent}} EventOptions
    * @param {EventOptions} opts
    */
    constructor(opts) {
	/** @type {String} */
	this.name = opts.name;
	this.once = opts.once;
	this.run = opts.run;
    }
}
