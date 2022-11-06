import { ActivityType } from "discord.js";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "ready",
    once: true,
    async run(bot) {
        try {
            await bot.application?.fetch();
            console.log(`¡${bot.user?.tag} ha iniciado a Discord!`);
            bot.user?.setPresence({ activities: [{ name: "Reprogramando a TypeScript.", type: ActivityType.Watching }], status: "dnd" });
        } catch (err) {
            console.error(err);
        }
    }
});