import { EventBuilder } from "../../structures/EventBuilder.js";

export default new EventBuilder({
  name: "shardReconnecting",
  run(bot, id: number) {
    try {
      console.log(`Shard: ${id} está intentando reconectarse.`);
    } catch (err) {
      if (err instanceof Error)
        bot.logger.writeError(err);
    }
  }
});
