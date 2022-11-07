import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "roleinfo",
    description: "Muestra información sobre el rol que menciones.",
    cooldown: 3,
    aliases: ["roleinf", "rinfo"],
    usage: "[@rol | ID]",
    example: "@Usuarios",
    async run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole) {
        try {
            if (!args[1]) return msg.reply(`Escribe el rol`);
            const role = getRole(args[1]);

            if (!role) return msg.reply(`No existe`);

            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
            .setColor(role.hexColor || "Random")
            .setTitle(`Información del rol @${role.name}`)
            .setDescription(`**Nombre:** ${role.name}\n**ID:** ${role.id}\n**Color:** ${role.hexColor}\n**Miembros con este rol:** ${role.members.size}\n**¿Separado?** ${role.hoist ? 'Sí' : 'No'}\n**¿Administrado?** ${role.managed ? 'Sí' : 'No'}\n**¿Mencionable?** ${role.mentionable ? 'Sí' : 'No'}\n**¿Editable?** ${role.editable ? 'Sí' : 'No'}\n**Fecha de creación:** <t:${Math.ceil(role.createdTimestamp / 1000)}>`)
            .addFields({ name: "Permisos", value: role.permissions.toArray().map(permission => bot.utils.guild.roles.permissions[permission]).join(", ") });

            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar obtener información del rol.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});