import { EventBuilder } from "../structures/EventBuilder.js";
import { EmbedBuilder, type HexColorString, bold } from "discord.js";

export default new EventBuilder({
  event: "messageCreate",
  async execute(message, client) {
    if (!message.inGuild()) return;

    const prefix = client.getPrefix(message.guildId);

    if (client.user && message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
      const embed = new EmbedBuilder()
      .setTitle("Hola!")
      .setDescription(`> ${bold(`Soy ${client.user?.username}`)}, un bot multipropósito en Español para su servidor de Discord.\n\n> Cuento con varios comandos de prefix (\`${prefix}\`) y de barra (\`/\`) para utilizar en su servidor.\n\n> Para empezar a usar mis comandos, puedes revisar la lista de comandos con \`${prefix}help\`\n\n> *・ ¡Muchas gracias por leer!* ${client.getEmoji("love")}`)
      .setColor(client.wrapper.get("bot.info", "color") as HexColorString);

      message.reply({ embeds: [embed] });
      return;
    }

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.substring(prefix.length).split(/\s+/g);

    if (!args[0]) return;

    const command = client.utils.receiveCommand(args[0]);

    if (!command) {
      message
        .reply(`El comando ${bold(args[0])} no fue encontrado.`)
        .then(msg =>
          setTimeout(async () => {
            if (msg.deletable) await msg.delete();
          }, 5000)
        );
      return;
    }

    const application = await client.application?.fetch();

    if (
      command.ownerOnly &&
      application &&
      message.author.id !== application.owner?.id
    )
      return;

    if (command.cooldown && command.cooldown > 0) {
      if (!client.cooldown.has(command.name))
        client.cooldown.set(command.name, new Map());

      const cooldownMSAmount = command.cooldown * 1000;
      const commandCollection = client.cooldown.get(command.name);

      if (!commandCollection) return;

      if (commandCollection.has(message.author.id)) {
        const expirationTime =
          commandCollection.get(message.author.id)! + cooldownMSAmount;

        if (Date.now() < expirationTime) {
          const time_left = (expirationTime - Date.now()) / 1000;
          message
            .reply(
              `Espera! Necesitas esperar ${time_left < 1 ? "unos segundos más" : time_left === 1 ? "*1 segundo*" : time_left >= 2 ? `*${time_left.toFixed(0)} segundos*` : `*${time_left.toFixed(0)} segundos*`} para volver a usar el comando **${command.name}**.`
            )
            .then(m =>
              setTimeout(async () => {
                if (m.deletable) await m.delete();
              }, cooldownMSAmount)
            );
          return;
        }
      }

      commandCollection.set(message.author.id, Date.now());
      setTimeout(() => {
        commandCollection.delete(message.author.id);
      }, cooldownMSAmount);
    }

    if (
      command.requiredClientPermissions &&
      message.guild.members.me &&
      !message.guild.members.me?.permissions.has(
        command.requiredClientPermissions
      )
    ) {
      const diffPerms = client.utils.diff(
        command.requiredClientPermissions,
        message.guild.members.me.permissions.toArray()
      );
      message.reply(
        client.beautifyMessage(
          `Me faltan los siguientes permisos para ejecutar acciones sobre este comando: ${client.utils.convertPermissionsToSpanish(diffPerms).join(", ")}`,
          {
            emoji: "error"
          }
        )
      );
      return;
    }

    if (
      command.requiredMemberPermissions &&
      message.guild.members.me &&
      message.member &&
      !message.member?.permissions.has(command.requiredMemberPermissions)
    ) {
      const diffPerms = client.utils.diff(
        command.requiredMemberPermissions,
        message.member.permissions.toArray()
      );
      message.reply(
        client.beautifyMessage(
          `Te faltan los siguientes permisos para ejecutar este comando: ${client.utils.convertPermissionsToSpanish(diffPerms).join(", ")}`,
          {
            emoji: "error"
          }
        )
      );
      return;
    }

    try {
      await command.run(client, message, args);
    } catch (error) {
      console.log("[ERROR]: Event could not running a command.");
      console.error(error);
    }
  }
});
