import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "npm",
    description: "Busca paquetes de node de la página npmjs.org",
    cooldown: 3,
    usage: "<paquete>",
    example: "axios",
    enabled: true,
    async run(bot, msg, args) {
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el nombre de algún paquete que esté en la página de npmjs.com.", { mention: msg.author.username, emoji: "noargs" }));

            const data = await fetch(`https://registry.npmjs.org/${args[1]}`, { method: 'GET' }).then(res => res.json());
            if(data.error) return msg.channel.send(bot.replyMessage(`El paquete **${args[1]}** no pudo ser encontrado en npmjs.org.`, { emoji: "error" }));

            const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!)
            .setTitle(data.name)
            .setDescription(`> __Información general__\n**Nombre del paquete:** ${data.name}\n**Descripción:** ${data.description}\n**Autor:** ${data.author ? data.author.name : 'Desconocido'}\n**Colaboradores:** ${data.maintainers.map(m => m.name).join(', ')}\n**Licencia** ${data.license}\n**Palabras claves:** ${data.keywords.map(k => k).join(', ')}\n**Instalación:** \`npm i ${data.name}\`\n**Última versión:** ${data['dist-tags'].latest}\n\n> __Links__\n${data.homepage ? `[Homepage](${data.homepage})` : 'Homepage: Ninguno'}\n${data.bugs ? `[Bugs](${data.bugs.url})` : 'Bugs: Ninguno'}`);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            bot.error("Ocurrió un error al intentar ejecutar el comando.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
        }
    }
});
