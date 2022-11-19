import { GuildBasedChannel, GuildMember, Message, PermissionsString, Role, User } from "discord.js";
import { Moonlight } from "../Moonlight";

interface CommandBuilderOptions {
    name: string;
    description: string;
    cooldown: number;
    aliases?: Array<string>;
    usage?: string;
    example?: string;
    enabled?: boolean;
    ownerOnly?: boolean;
    memberPerms?: Array<PermissionsString>;
    botPerms?: Array<PermissionsString>;
    run: (bot: Moonlight, msg: Message, args: Array<string>, prefix: string, getUser: (user: string) => Promise<User | undefined>, getMember: (member: string) => GuildMember | undefined, getChannel: (channel: string) => GuildBasedChannel | undefined, getRole: (role: string) => Role | undefined) => void;
}

export class CommandBuilder {
    public name: CommandBuilderOptions["name"];
    public description: CommandBuilderOptions["description"];
    public cooldown: CommandBuilderOptions["cooldown"];
    public aliases?: CommandBuilderOptions["aliases"];
    public usage?: CommandBuilderOptions["usage"];
    public example?: CommandBuilderOptions["example"];
    public enabled?: CommandBuilderOptions["enabled"];
    public ownerOnly?: CommandBuilderOptions["ownerOnly"];
    public memberPerms?: CommandBuilderOptions["memberPerms"];
    public botPerms?: CommandBuilderOptions["botPerms"];
    public run: CommandBuilderOptions["run"];

    constructor(options: CommandBuilderOptions) {
        this.name = options.name;
        this.description = options.description;
        this.cooldown = options.cooldown;
        this.aliases = options.aliases;
        this.usage = options.usage;
        this.example = options.example;
        this.enabled = options.enabled;
        this.ownerOnly = options.ownerOnly;
        this.memberPerms = options.memberPerms;
        this.botPerms = options.botPerms;
        this.run = options.run;
    }
}
