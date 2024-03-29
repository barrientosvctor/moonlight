import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
  name: "shardError",
  run(bot, error: Error, shardId: number) {
    try {
      console.log(`Shard: ${shardId} encontró un error: ${error}`);
      console.error(error);
    } catch (err) {
      bot.logger.writeError(err);
    }
  }
});
