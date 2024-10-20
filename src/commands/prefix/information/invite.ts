import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";
import { hyperlink } from "discord.js";

export default new LegacyCommandBuilder({
  name: "invite",
  cooldown: 5,
  category: "Información",
  description: "Este comando te permite invitarme a tu servidor.",
  run(client, message) {
    return message.reply(
      `Gracias por considerar añadirme a tú servidor. Presiona ${hyperlink("aquí", client.wrapper.get("bot.info", "invite"))} para invitarme a tu servidor. ❤️`
    );
  }
});
