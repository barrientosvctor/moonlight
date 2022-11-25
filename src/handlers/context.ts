import { Moonlight } from "../Moonlight";
import { readdirSync } from "node:fs";
import { ContextMenuBuilder } from "../structures/ContextMenuBuilder";

export const ContextMenuHandler = (bot: Moonlight) => {
    readdirSync("./src/slashcommands/Context").filter(f => f.endsWith(".ts")).forEach(async file => {
        const { default: context }: { default: ContextMenuBuilder } = (await import(`../slashcommands/Context/${file}`));

        bot.slash.set(context.name, context);
    });
}
