import Type from "../../Moonlight";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "shardResume",
    run(bot, id: number, replayedEvents: number) {
        try {
            console.log(`Shard: ${id} se reconectó correctamente! Número de intentos: ${replayedEvents}`);
        } catch (err) {
            bot.error("Hubo un error en el evento.", { name: this.name, type: Type.Event, error: err });
        }
    }
});