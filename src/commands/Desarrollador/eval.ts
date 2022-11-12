import { CommandBuilder } from "../../structures/CommandBuilder";
import { inspect } from "node:util";
import { MoonlightEmbedBuilder } from "../../structures/MoonlightEmbedBuilder";

export default new CommandBuilder({
    name: "eval",
    description: "Evalua código TypeScript.",
    cooldown: 3,
    usage: "<código>",
    example: "2+2",
    enabled: true,
    ownerOnly: true,
    async run(bot, msg, args) {
        const embed = new MoonlightEmbedBuilder(msg.author, msg.guild!);
        try {
            if (!args[1]) return msg.channel.send(bot.replyMessage("escribe el código a ejecutar.", { mention: msg.author.username, emoji: "noargs" }));

            let result;
            try {
                result = await eval(args.slice(1).join(" "));
            } catch (error) {
                result = error;
            }

            embed.setColor("Green")
            embed.setTitle("¡Código evaluado correctamente!")
            embed.setDescription(`**Tipo:** \`\`\`prolog\n${typeof(eval(args.slice(1).join(' ')))}\`\`\`\n**Evaluado en:** \`\`\`yaml\n${msg.createdTimestamp - Date.now()}ms\`\`\`\n**Entrada:** \`\`\`js\n${args.slice(1).join(' ')}\`\`\`\n**Salida:** \`\`\`js\n${inspect(eval(args.slice(1).join(" ")), { depth: 0 })}\`\`\``);
            return msg.reply({ embeds: [embed] });
        } catch (err) {
            embed.setColor("Red")
            embed.setTitle("Hubo un error al evaluar el código.")
	        embed.addFields({ name: "Entrada", value: `\`\`\`js\n${args.slice(1).join(' ')}\`\`\`` }, { name: 'Error', value: `\`\`\`js\n${err}\`\`\`` });
            return msg.reply({ embeds: [embed] });
        }
    }
});
