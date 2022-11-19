import { ClientEvents } from "discord.js";
import { Moonlight } from "../Moonlight";

interface EventBuilderOptions {
    name: keyof ClientEvents;
    once?: boolean;
    run: (bot: Moonlight, ...args: any[]) => void;
}

export class EventBuilder {
    public name: EventBuilderOptions["name"];
    public once?: EventBuilderOptions["once"];
    public run: EventBuilderOptions["run"];

    constructor(options: EventBuilder) {
        this.name = options.name;
        this.once = options.once;
        this.run = options.run;
    }
}
