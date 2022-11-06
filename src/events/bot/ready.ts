import { ActivityType } from "discord.js";
import Type from "../../Moonlight";
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
            bot.error("Hubo un error en el evento.", { name: this.name, type: Type.Event, error: err });
        }
    }
});