import { GuildMember } from "discord.js";
import { MoonlightDatabase } from "../../databases";
import Type from "../../Moonlight";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "guildMemberAdd",
    async run(bot, member: GuildMember) {
        try {
            const autorole_db = new MoonlightDatabase("autorole.json");
            if (autorole_db.has(`autorole_user-${member.guild.id}`) || autorole_db.has(`autorole_bot-${member.guild.id}`)) {
                if (member.user?.bot) await member.roles?.add(await autorole_db.get(`autorole_bot-${member.guild.id}`) as string).catch(() => {});
                else await member.roles?.add(await autorole_db.get(`autorole_user-${member.guild.id}`) as string).catch(() => {});
            }
        } catch (err) {
            bot.error("Hubo un error en el evento.", { name: "ready", type: Type.Event, error: err });
        }
    }
});
