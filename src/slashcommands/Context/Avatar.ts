import { ContextMenuBuilder } from "../../structures/ContextMenuBuilder";

export default new ContextMenuBuilder()
.setName("Avatar")
.setType(2)
.setCallback(async ({ bot, interaction }) => {
    return interaction.reply("a");
});
