import { EventBuilder } from "../structures/EventBuilder.js";

export default new EventBuilder({
  name: "ready",
  once: true,
  execute(_) {
    console.log("hola desde ready")
  }
})
