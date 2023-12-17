import { EventBuilder } from "../../structures/EventBuilder.js";

export default new EventBuilder({
  name: "shardResume",
  run(bot, id: number, replayedEvents: number) {
    try {
      console.log(`Shard: ${id} se reconectó correctamente! Número de intentos: ${replayedEvents}`);
    } catch (err) {
      if (err instanceof Error)
        bot.logger.writeError(err);
    }
  }
});
