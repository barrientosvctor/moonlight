import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "shardReconnecting",
    run(bot, id: number) {
        try {
            console.log(`Shard: ${id} está intentando reconectarse.`);
        } catch (err) {
            console.error(err);
        }
    }
});