import { CommandBuilder } from "../../structures/CommandBuilder";
import { readdirSync } from "node:fs";
import info from "../../../package.json";
import Type from "../../Moonlight";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "botinfo",
    description: "Muestra información acerca del bot.",
    cooldown: 3,
    aliases: ["bot"],
    enabled: true,
    async run(bot, msg, args, prefix) {
        try {
            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
            .setThumbnail(bot.user?.displayAvatarURL() || null)
            .setDescription(`> __Información general__\n**Servidores:** ${bot.guilds.cache.size}\n**Comandos:** ${bot.commands.size}\n**Categorías:** ${readdirSync("./src/commands").length}\n**Fecha de creación:** <t:${Math.ceil(bot.user!.createdTimestamp / 1000)}>\n**Prefix predeterminado:** !!\n**Prefix in-server:** ${prefix}\n**Conectado desde:** <t:${Math.ceil(bot.readyTimestamp! / 1000)}:R>\n\n> __Latencia__\n**Bot:** ${msg.createdTimestamp - Date.now()}ms\n**WebSocket:** ${bot.ws.ping}ms\n\n> __Desarrollo__\n**Desarrollador:** ${bot.users.cache.get(bot.application?.owner?.id!)?.tag}\n**Lenguaje:** TypeScript\n**Dependencias:** ${Object.keys(info.dependencies).length}\n**Versión:** v${info.version}\n**Librería:** discord.js${info.dependencies["discord.js"]}\n**Node.js:** ${process.version}`);

            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Hubo un error al intentar obtener los datos del bot.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
