import { ActivityType } from "discord.js";
import Type from "../../Moonlight";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
  name: "ready",
  once: true,
  async run(bot) {
    try {
      await bot.application?.fetch();
      // await bot.guilds.cache.get("").commands.set(bot.slash.map(slash => slash.toJSON())).catch(err => console.error(err));
      await bot.application.commands
      .set(bot.slash.map(slash => slash.toJSON()))
      .catch(err => console.error(err));

      console.log(`¡${bot.user?.tag} ha iniciado a Discord!`);

      bot.user?.setPresence({
        activities: [{
          name: "Hola! Soy Moonlight. | !!help",
          type: ActivityType.Playing
        }],
        status: "online"
      });
    } catch (err) {
      bot.error("Hubo un error en el evento.", { name: "ready", type: Type.Event, error: err });
    }
  }
});
