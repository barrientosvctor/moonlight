import { ChannelType, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { SlashCommand } from "../../structures/CommandBuilder.js";

export default new SlashCommand({
  data: new SlashCommandBuilder()
  .setName("purge")
  .setDescription("Delete an amount of messages from some text channel.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
  .addStringOption(input =>
                   input
  .setName("amount")
  .setDescription("Type the number of messages to delete.")
  .setRequired(true)
  .setMinLength(1)
  .setMaxLength(3))
  .addChannelOption(ch =>
                    ch
  .setName("channel")
  .setDescription("In which channel do you want to delete those messages?")
  .setRequired(false))
  .addBooleanOption(b =>
                    b
  .setName("hidden")
  .setDescription("Should the bot's response be hidden?")
  .setRequired(false)),
  testGuildOnly: true,
  clientPermissions: ["ManageMessages"],
  async run(interaction) {
    const amount = interaction.options.getString("amount", true);
    const channel = interaction.options.getChannel("channel", false) ?? interaction.channel;
    const hidden = interaction.options.getBoolean("hidden", false) ?? false;
    const numMessages = Number(amount);

    if (Number.isNaN(numMessages))
      return interaction.reply({ content: "La cantidad de mensajes a eliminar debe ser un número.", ephemeral: true });

    if (!(Number.isInteger(numMessages) && Number.isSafeInteger(numMessages)))
      return interaction.reply({ content: "La cantidad de mensajes a eliminar debe ser un número entero.", ephemeral: true });

    if (!channel)
      return interaction.reply({ content: "Canal no encontrado.", ephemeral: true });

    if (channel.type !== ChannelType.GuildText)
      return interaction.reply({ content: "Solo puedo hacer esta acción con canales de texto.", ephemeral: true });

    if (numMessages < 1 || numMessages > 100)
      return interaction.reply({ content: "Solo puedo eliminar entre 1 y 100 mensajes.", ephemeral: true });

    try {
      await (channel as TextChannel).bulkDelete(numMessages, true);
    } catch (error) {
      console.error(error);
      return interaction.reply({ content: "Ocurrió un error al intentar eliminar los mensajes.", ephemeral: true });
    }

    return interaction.reply({ content: `${numMessages} mensajes eliminados.`, ephemeral: hidden });
  }
});
