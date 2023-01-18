import { readdirSync } from "node:fs";
import { Moonlight } from "../Moonlight";
import { CommandBuilder } from "../structures/CommandBuilder";

export const CommandHandler = (bot: Moonlight): void => {
    readdirSync("./src/commands").forEach(folder => {
        const commands: Array<string> = readdirSync(`./src/commands/${folder}`).filter(f => f.endsWith(".ts"));

        bot.categories.set(folder, { name: folder, commands: commands });

        commands.forEach(async file => {
            const command: CommandBuilder = (await import(`../commands/${folder}/${file}`)).default;

            bot.commands.set(command.name, command);
            if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach(alias => bot.aliases.set(alias, command.name));
        });
    });
    console.log("Comandos cargados.");
    console.log("Categorías actualizadas.");
}