import { EmbedBuilder } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";

export default new CommandBuilder({
    name: "mdn",
    description: "Muestra información de la documentación de Mozilla Developer Network.",
    cooldown: 3,
    usage: "<busqueda>",
    example: "Array.propotype.map()",
    enabled: true,
    ownerOnly: true,
    async run(bot, msg, args) {
	try {
	    if (!args[1]) return msg.reply(`Escribe lo que quieres buscar en la documentación.`);

	    const data = await fetch(`https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(args.slice(1).join(" "))}&locale=es`).then(res => res.json());
	    let message: Array<string> = [];

	    console.log(data.documents);
	    for (let x = 0; x < data.documents.length; x++) {
		message.push(`${x+1}. ${data.documents[x].title}`);
	    }
	    console.log(message);

	    const embed = new EmbedBuilder()
	    .setTitle(`Resultados con ${args[1]}`)
	    .setDescription(message.join("\n"))
	    .setColor("Random")

	    return msg.reply({ embeds: [embed] });
	} catch (err) {
            bot.error("Hubo un error al intentar obtener los datos de la documentación.", { name: this.name, type: Type.Command, channel: msg.channel, error: err });
	}
    }
});
