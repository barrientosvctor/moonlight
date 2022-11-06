import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "shardDisconnect",
    run(bot, event: CloseEvent, id: number) {
        try {
            console.log(`Shard: ${id} se desconectó. Razón: ${event.reason}`);
        } catch (err) {
            console.error(err);
        }
    }
});