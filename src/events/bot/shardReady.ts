import { EventBuilder } from "../../structures/EventBuilder.js";

export default new EventBuilder({
  name: "shardReady",
  run(bot, id: number) {
    try {
      console.log(`Shard: ${id} está listo para funcionar.`);
    } catch (err) {
      if (err instanceof Error)
        bot.logger.writeError(err);
    }
  }
});
