import { ContextMenuBuilder } from "../../structures/ContextMenuBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new ContextMenuBuilder()
.setName("Avatar")
.setType(2)
.setCallback(async ({ bot, interaction }) => {
    try {
        const member = interaction.guild.members.cache.get(interaction.targetId);
        if (!member) return;

        const embed = new MoonlightEmbedBuilder(interaction.user, interaction.guild!)
        .setDescription(`Avatar de ${member.user.tag}\n[PNG](${member.user.displayAvatarURL({ size: 2048, extension: "png" })}) | [JPG](${member.user.displayAvatarURL({ size: 2048, extension: "jpg" })}) | [WEBP](${member.user.displayAvatarURL({ size: 2048, extension: "webp" })}) ${member.user.avatar.startsWith("a_") ? `| [GIF](${member.user.displayAvatarURL({ size: 2048, extension: "gif" })})` : ``}`)
        .setImage(member.user.displayAvatarURL({ size: 2048, extension: "png" }));
        return interaction.reply({ embeds: [embed] });
    } catch (err) {
        console.error(err);
    }
});
