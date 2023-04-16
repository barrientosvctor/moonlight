import { ContextMenuBuilder } from "../../structures/ContextMenuBuilder";

export default new ContextMenuBuilder()
.setName("Kick")
.setType(2)
.setCallback(async ({ bot, interaction }) => {
  try {
    const member = interaction.guild.members.cache.get(interaction.targetId);
    if (!member) return;

    if (member === interaction.member) return interaction.reply({ content: bot.replyMessage("No puedes expulsarte a tí mismo.", { emoji: "error" }), ephemeral: true });
    if (member === interaction.guild.members.me) return interaction.reply({ content: bot.replyMessage("No puedes expulsarme con mis comandos.", { emoji: "error" }), ephemeral: true });
    if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: bot.replyMessage("No puedo expulsar a este usuario debido a que su rol es igual o superior al tuyo.", { emoji: "error" }), ephemeral: true });
    if (!member.manageable) return interaction.reply({ content: bot.replyMessage("No puedo expulsar a este usuario debido a que su rol es igual o superior al mío.", { emoji: "error" }), ephemeral: true });
    if (!member.kickable) return interaction.reply({ content: bot.replyMessage("No puedo expulsar a este usuario.", { emoji: "error" }), ephemeral: true });

    await member.kick(`Usuario expulsado por: ${interaction.user.tag}`).then(async () => {
      await member.user.send(`> ${bot.getEmoji("warning")} Has sido expulsado de **${interaction.guild.name}** por **${interaction.user.tag}**!`).catch(() => {});
      return interaction.reply(bot.replyMessage(`**${member.user.tag}** (\`${member.user.id}\`) ha sido expulsado del servidor.`, { emoji: "check" }));
    }).catch(err => {
      console.error(err);
      if (!interaction.replied) interaction.reply(bot.replyMessage("Hubo un error al intentar expulsar a este usuario.", { emoji: "warning" }));
    });
  } catch (err) {
    console.error(err);
  }
});
