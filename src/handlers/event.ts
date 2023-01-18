import { readdirSync } from "node:fs";
import { Moonlight } from "../Moonlight";
import { EventBuilder } from "../structures/EventBuilder";

export const EventHandler = (bot: Moonlight): void => {
    readdirSync("./src/events").forEach(folder => {
        readdirSync(`./src/events/${folder}`).filter(f => f.endsWith(".ts")).forEach(async file => {
            const event: EventBuilder = (await import(`../events/${folder}/${file}`)).default;

            if (event.once) bot.once(event.name, event.run.bind(null, bot));
            else bot.on(event.name, event.run.bind(null, bot));
        });
    });
}