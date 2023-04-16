import Type from "../../Moonlight";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
  name: "shardDisconnect",
  run(bot, event: CloseEvent, id: number) {
    try {
      console.log(`Shard: ${id} se desconectó. Razón: ${event.reason}`);
    } catch (err) {
      bot.error("Hubo un error en el evento.", { name: "shardDisconnect", type: Type.Event, error: err });
    }
  }
});
