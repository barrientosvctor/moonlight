import { ChatInputCommandInteraction, ContextMenuCommandInteraction, GuildBasedChannel, GuildMember, Interaction, Message, Role, User } from "discord.js";
import Type from "../../Moonlight";
import { ContextMenuBuilder } from "../../structures/ContextMenuBuilder";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
  name: "interactionCreate",
  async run(bot, interaction: ContextMenuCommandInteraction<"cached">) {
    try {
      const command: ContextMenuBuilder = bot.slash.get(interaction.commandName);
      if (!command) return;

      try {
        command.callback({ bot, interaction });
      } catch (error) {
        console.error(error);
      }
    } catch (err) {
      bot.error("Hubo un error en el evento.", { name: "interactionCreate", type: Type.Event, error: err });
    }
  }
});
