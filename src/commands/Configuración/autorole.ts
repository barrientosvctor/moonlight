import { MoonlightDatabase } from "../../databases";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
  name: "autorole",
  description: "Establece un rol a los nuevos usuarios o bots que entren al servidor.",
  cooldown: 3,
  usage: "<set / delete / list> <user / bot> <@rol | ID>",
  example: "set user @Usuarios",
  enabled: true,
  memberPerms: ["ManageRoles"],
  botPerms: ["ManageGuild"],
  async run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole) {
    try {
      if (!args[1]) return msg.channel.send(bot.replyMessage("escribe una de las siguientes opciones:\n`set`: Establece un nuevo rol automático en el servidor.\n`delete`: Elimina el rol ya establecido del servidor.\n`list`: Muestra los roles que han sido establecidos para cada tipo de usuario en el servidor.", { mention: msg.author.username, emoji: "noargs" }));
      const db = new MoonlightDatabase("autorole.json");
      let embed = new MoonlightEmbedBuilder(msg.author, msg.guild!);
      let dbValue: string;

      if (args[2] === "user") dbValue = `autorole_user-${msg.guildId}`;
      else if (args[2] === "bot") dbValue = `autorole_bot-${msg.guildId}`;

      if (args[1] === "set") {
        if (!args[2]) return msg.channel.send(bot.replyMessage("escribe \`user\` o \`bot\` para especificar el tipo de usuario al que se le dará algún rol.", { mention: msg.author.username, emoji: "noargs" }));
        if (!["user", "bot"].includes(args[2])) return msg.reply(bot.replyMessage("Tipo de usuario no válido.", { emoji: "error" }));

        if (!args[3]) return msg.channel.send(bot.replyMessage(`menciona o escribe la ID del rol que le vas a asignar a los nuevos ${args[2] === "user" ? "usuarios" : "bots"}.`, { mention: msg.author.username, emoji: "noargs" }));
        const role = getRole(args[3]);
        if (!role) return msg.reply(bot.replyMessage("Este rol no existe en el servidor.", { emoji: "error" }));
        if (role.position >= msg.guild!.members.me?.roles.highest.position) return msg.reply(bot.replyMessage("No puedo añadir este rol debido a que jerárquicamente tiene un puesto mayor o igual al mío.", { emoji: "error" }));
        if (role.position >= msg.member!.roles?.highest?.position) return msg.reply(bot.replyMessage("No puedo añadir el rol ya que jerárquicamente tiene un puesto mayor o igual al tuyo!", { emoji: "error" }));
        if (role.managed) return msg.reply(bot.replyMessage("No puedo asignar roles que estén administrados por una integración, prueba con otro.", { emoji: "warning" }));

        if (db.has(dbValue) && db.get(dbValue) === role?.id) return msg.reply(bot.replyMessage(`Este rol ya ha sido establecido anteriormente para los ${args[2] === "user" ? "usuarios" : "bots"}, prueba con otro.`, { emoji: "error" }));
        else {
          db.set(dbValue, role?.id);
          return msg.reply(bot.replyMessage(`A partir de ahora el rol **${role.name}** será otorgado a los ${args[2] === "user" ? "usuarios" : "bots"} cada vez que entren al servidor.`, { emoji: "check" }));
        }
      } else if (args[1] === "delete") {
        if (!args[2]) return msg.channel.send(bot.replyMessage("escribe \`user\` o \`bot\` para eliminar el rol que se le haya asignado (en caso de haber establecido uno).", { mention: msg.author.username, emoji: "noargs" }));
        if (!db.has(dbValue)) return msg.reply(bot.replyMessage(`En el servidor no se ha asignado un rol para los ${args[2] === "user" ? "usuarios" : "bots"}, para establecer uno haz uso del comando \`${prefix}${this.name} set ${args[2] === "user" ? "user" : "bot"}\``, { emoji: "error" }));
        else {
          db.delete(dbValue);
          return msg.reply(bot.replyMessage(`El rol ha sido eliminado éxitosamente.`, { emoji: "check" }));
        }
      } else if (args[1] === "list") {
        embed.setTitle("Lista de roles")
        embed.addFields({ name: "Usuario", value: db.has(`autorole_user-${msg.guildId}`) ? `<@&${await db.get(`autorole_user-${msg.guildId}`)}>` : "Ninguno" }, { name: "Bot", value: db.has(`autorole_bot-${msg.guildId}`) ? `<@&${await db.get(`autorole_bot-${msg.guildId}`)}>` : "Ninguno" });
        return msg.reply({ embeds: [embed] });
      } else return msg.reply(bot.replyMessage("Opción no válida.", { emoji: "error" }));
    } catch (err) {
      bot.logger.writeError(err);
      bot.sendErrorMessage(msg.channel);
    }
  }
});
