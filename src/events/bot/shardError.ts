import Type from "../../Moonlight";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "shardError",
    run(bot, error: Error, shardId: number) {
        try {
            console.log(`Shard: ${shardId} encontró un error: ${error}`);
            console.error(error);
        } catch (err) {
            bot.error("Hubo un error en el evento.", { name: "shardError", type: Type.Event, error: err });
        }
    }
});
