import { LegacyCommandBuilder } from "../../../structures/CommandBuilder.js";

export default new LegacyCommandBuilder({
  name: "reverse",
  description: "Pon en reversa un texto.",
  cooldown: 5,
  category: "Entretenimiento",
  async run(client, message, args) {
    if (!args[1])
      return message.channel.send(
        client.beautifyMessage("escibe el texto que pondré en reversa.", {
          mention: message.author.username,
          emoji: "noargs"
        })
      );
    return message.reply(args.slice(1).join(" ").split("").reverse().join(""));
  }
});
