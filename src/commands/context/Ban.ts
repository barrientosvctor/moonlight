import { ApplicationCommandType, ContextMenuCommandBuilder, bold, inlineCode } from "discord.js";
import { ContextMenu } from "../../structures/CommandBuilder.js";

export default new ContextMenu({
  data: new ContextMenuCommandBuilder()
  .setName("Ban")
  .setType(ApplicationCommandType.User)
  .setDMPermission(false),
  async run(interaction, client) {
    if (!interaction.guild || !interaction.member) return;

    if (!interaction.inCachedGuild()) return interaction.reply({ content: client.beautifyMessage("Para seguir, esta interacción debe estar en cache.", { emoji: "error" }), ephemeral: true });

    const member = interaction.guild.members.cache.get(interaction.targetId);
    if (!member) return;

    if (member === interaction.member) return interaction.reply({ content: client.beautifyMessage("No puedes banearte a tí mismo.", { emoji: "error" }), ephemeral: true });
    if (member === interaction.guild.members.me) return interaction.reply({ content: client.beautifyMessage("No puedes banearme con mis comandos.", { emoji: "error" }), ephemeral: true });
    if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: client.beautifyMessage("No puedo banear a este usuario debido a que su rol es igual o superior al tuyo.", { emoji: "error" }), ephemeral: true });
    if (!member.manageable) return interaction.reply({ content: client.beautifyMessage("No puedo banear a este usuario debido a que su rol es igual o superior al mío.", { emoji: "error" }), ephemeral: true });
    if (!member.bannable) return interaction.reply({ content: client.beautifyMessage("No puedo banear a este usuario.", { emoji: "error" }), ephemeral: true });

    try {
      await member.ban({ reason: `Usuario expulsado por: ${interaction.user.tag}.` });
    } catch (error) {
      console.error(error);
      if (!interaction.replied) interaction.reply(client.beautifyMessage("Hubo un error al intentar banear a este usuario.", { emoji: "warning" }));
    }

    return interaction.reply(client.beautifyMessage(`${bold(member.user.tag)} (${inlineCode(member.user.id)}) ha sido baneado del servidor.`, { emoji: "check" }));
  }
});
