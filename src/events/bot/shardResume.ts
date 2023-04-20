import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
  name: "shardResume",
  run(bot, id: number, replayedEvents: number) {
    try {
      console.log(`Shard: ${id} se reconectó correctamente! Número de intentos: ${replayedEvents}`);
    } catch (err) {
      bot.logger.writeError(err);
    }
  }
});
