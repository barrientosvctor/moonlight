import { EventBuilder } from "../structures/EventBuilder.js";

export default new EventBuilder({
  event: "guildMemberAdd",
  async execute(member, client) {
    if (client.database.has("autorole", `user-${member.guild.id}`) && !member.roles.cache.has(client.database.get("autorole", `user-${member.guild.id}`)!) && !member.user.bot) {
      try {
        await member.roles.add(client.database.get("autorole", `user-${member.guild.id}`)!)
      } catch (error) {
        console.error(`I couldn't add the user autorole in ${member.guild.name}.`);
      }
    } else if (client.database.has("autorole", `bot-${member.guild.id}`) && !member.roles.cache.has(client.database.get("autorole", `bot-${member.guild.id}`)!) && member.user.bot) {
      try {
        await member.roles.add(client.database.get("autorole", `bot-${member.guild.id}`)!);
      } catch (error) {
        console.error(`I couldn't add the bot autorole in ${member.guild.name}.`);
      }
    }
  }
});
