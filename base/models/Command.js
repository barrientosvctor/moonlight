let discord = require('discord.js'),
Moonlight = require('../Moonlight');

/**
 * 
 * @param {Moonlight} bot 
 * @param {discord.Message} msg 
 * @param {String[]} args 
 * @param {discord.User} getUser 
 * @param {discord.GuildMember} getMember 
 * @param {discord.Role} getRole 
 * @param {discord.GuildChannel} getChannel 
 */
function runFns(bot, msg, args, prefix, getUser, getMember, getRole, getChannel) {}
module.exports = class Command {
    /**
     * 
     * @typedef {{name: string, description: string, cooldown: number, aliases: object, category: string, usage: string, example: string, ownerOnly: boolean, nsfwOnly: boolean, enabled: boolean, botPerms: discord.PermissionsString[], memberPerms: discord.PermissionsString[], dirname: string, filename: string, run: runFns}} CmdOpts
     * @param {CmdOpts} opts
     */
    constructor(opts) {
        /** @type {string} */
        this.name = opts.name;
        /** @type {String} */
        this.description = opts.description;
        /** @type {Number} */
        this.cooldown = opts.cooldown;
        /** @type {String[]} */
        this.aliases = opts.aliases;
        /** @type {String} */
        this.category = opts.category;
        /** @type {String} */
        this.usage = opts.usage;
        /** @type {String} */
        this.example = opts.example;
        /** @type {Boolean} */
        this.ownerOnly = opts.ownerOnly;
        /** @type {Boolean} */
        this.nsfwOnly = opts.nsfwOnly;
        /** @type {Boolean} */
        this.enabled = opts.enabled;
        /** @type {discord.PermissionsString[]} */
        this.botPerms = opts.botPerms;
        /** @type {discord.PermissionsString[]} */
        this.memberPerms = opts.memberPerms;
        /** @type {String} */
        this.dirname = opts.dirname;
        /** @type {String} */
        this.filename = opts.filename;
        /** @type {runFns} */
        this.run = opts.run;
    }
};
