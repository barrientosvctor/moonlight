import { ContextMenuBuilder } from "../../structures/ContextMenuBuilder";

export default new ContextMenuBuilder()
.setName("Ban")
.setType(2)
.setCallback(async ({ bot, interaction }) => {
    try {
        const member = interaction.guild.members.cache.get(interaction.targetId);
        if (!member) return;

        if (member === interaction.member) return interaction.reply({ content: bot.replyMessage("No puedes banearte a tí mismo.", { emoji: "error" }), ephemeral: true });
        if (member === interaction.guild.members.me) return interaction.reply({ content: bot.replyMessage("No puedes banearme con mis comandos.", { emoji: "error" }), ephemeral: true });
        if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({ content: bot.replyMessage("No puedo banear a este usuario debido a que su rol es igual o superior al tuyo.", { emoji: "error" }), ephemeral: true });
        if (!member.manageable) return interaction.reply({ content: bot.replyMessage("No puedo banear a este usuario debido a que su rol es igual o superior al mío.", { emoji: "error" }), ephemeral: true });
        if (!member.bannable) return interaction.reply({ content: bot.replyMessage("No puedo banear a este usuario.", { emoji: "error" }), ephemeral: true });

        await member.ban({ reason: `Usuario expulsado por: ${interaction.user.tag}` }).then(async () => {
            await member.user.send(`> ${bot.getEmoji("warning")} Has sido baneado de **${interaction.guild.name}** por **${interaction.user.tag}**!`).catch(console.error);
            return interaction.reply(bot.replyMessage(`**${member.user.tag}** (\`${member.user.id}\`) ha sido baneado del servidor.`, { emoji: "check" }));
        }).catch(err => {
            console.error(err);
            if (!interaction.replied) interaction.reply(bot.replyMessage("Hubo un error al intentar expulsar a este usuario.", { emoji: "warning" }));
        });
    } catch (err) {
        console.error(err);
    }
});
