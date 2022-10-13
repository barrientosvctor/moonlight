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
	/** @type {discord.ClientEvents} */
	this.name = opts.name;
	/** @type {boolean} */
	this.once = opts.once;
	/** @type {runEvent} */
	this.run = opts.run;
    }
}
