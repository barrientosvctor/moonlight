import { Database } from "../structures/Database.js";
import { EventBuilder } from "../structures/EventBuilder.js";

export default new EventBuilder({
  event: "guildMemberAdd",
  async execute(member) {
    const db = Database.instance;
    if (
      db.has("autorole", `user-${member.guild.id}`) &&
      !member.roles.cache.has(db.get("autorole", `user-${member.guild.id}`)!) &&
      !member.user.bot
    ) {
      try {
        await member.roles.add(db.get("autorole", `user-${member.guild.id}`)!);
      } catch (error) {
        console.error(
          `I couldn't add the user autorole in ${member.guild.name}.`
        );
      }
    } else if (
      db.has("autorole", `bot-${member.guild.id}`) &&
      !member.roles.cache.has(db.get("autorole", `bot-${member.guild.id}`)!) &&
      member.user.bot
    ) {
      try {
        await member.roles.add(db.get("autorole", `bot-${member.guild.id}`)!);
      } catch (error) {
        console.error(
          `I couldn't add the bot autorole in ${member.guild.name}.`
        );
      }
    }
  }
});
