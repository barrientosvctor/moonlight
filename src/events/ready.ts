import { EventBuilder } from "../structures/EventBuilder.js";

export default new EventBuilder({
  event: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} is online!`);
  }
});
