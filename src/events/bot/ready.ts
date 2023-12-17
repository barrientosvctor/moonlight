import { ActivityType } from "discord.js";
import { EventBuilder } from "../../structures/EventBuilder.js";

export default new EventBuilder({
  name: "ready",
  once: true,
  async run(bot) {
    try {
      await bot.application?.fetch();
      await bot.guilds.cache.get("744764718543011902")?.commands.set(bot.slash.map(slash => slash.toJSON())).catch(err => console.error(err));
      // await bot.application.commands
      // .set(bot.slash.map(slash => slash.toJSON()))
      // .catch(err => console.error(err));

      console.log(`¡${bot.user?.tag} ha iniciado a Discord!`);

      bot.user?.setPresence({
        activities: [{
          name: "Hola! Soy Moonlight. | !!help",
          type: ActivityType.Playing
        }],
        status: "online"
      });
    } catch (err) {
      if (err instanceof Error)
        bot.logger.writeError(err);
    }
  }
});
