import { GuildMember } from "discord.js";
import { MoonlightDatabase } from "../../databases/index.js";
import { EventBuilder } from "../../structures/EventBuilder.js";

export default new EventBuilder({
  name: "guildMemberAdd",
  async run(bot, member: GuildMember) {
    try {
      const autorole_db = new MoonlightDatabase("autorole.json");
      if (autorole_db.has(`autorole_user-${member.guild.id}`) || autorole_db.has(`autorole_bot-${member.guild.id}`)) {
        if (member.user && member.roles) {
          if (member.user.bot)
            await member.roles.add(await autorole_db.get(`autorole_bot-${member.guild.id}`) as string).catch(() => { });
          else
            await member.roles.add(await autorole_db.get(`autorole_user-${member.guild.id}`) as string).catch(() => { });
        }
      }
    } catch (err) {
      if (err instanceof Error)
        bot.logger.writeError(err);
    }
  }
});
