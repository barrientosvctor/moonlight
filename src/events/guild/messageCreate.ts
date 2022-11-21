import { GuildBasedChannel, GuildMember, Message, Role, User } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "messageCreate",
    async run(bot, msg: Message) {
        try {
            const prefix: string = await bot.getPrefix(msg.guildId);
            const args: Array<string> = msg.content.substring(prefix.length).split(" ");
            const command: CommandBuilder | undefined = bot.commands.get(args![0]) || bot.commands.get(bot.aliases.get(args[0])!)

            if (!args[0] || !msg.guild || msg.author.bot || !msg.content.startsWith(prefix)) return;

            const getUser = async (user: string): Promise<User | undefined> => {
                if (!user) return;
                else {
                    if (user.startsWith("\\")) user = user.slice(1);
                    if (user.startsWith("<@") && user.endsWith(">")) user = user.slice(2, -1);
                    if (!Number(user) && user.length !== 18) return;
                }

                return await bot.users?.fetch(user);
            }

            const getMember = (member: string): GuildMember | undefined => {
                if (!member) return;
                else {
                    if (member.startsWith("\\")) member = member.slice(1);
                    if (member.startsWith("<@") && member.endsWith(">")) member = member.slice(2, -1);
                    if (!Number(member) && member.length !== 18) return;
                }

                return msg.guild?.members.cache?.get(member);
            }

            const getChannel = (channel: string): GuildBasedChannel | undefined => {
                if (!channel) return;
                else {
                    if (channel.startsWith("\\")) channel = channel.slice(1);
                    if (channel.startsWith("<@") && channel.endsWith(">")) channel = channel.slice(2, -1);
                    if (!Number(channel) && channel.length !== 18) return;
                }

                return msg.guild?.channels.cache?.get(channel);
            }

            const getRole = (role: string): Role | undefined => {
                if (!role) return;
                else {
                    if (role.startsWith("\\")) role = role.slice(1);
                    if (role.startsWith("<@&") && role.endsWith(">")) role = role.slice(3, -1);
                    if (!Number(role) && role.length !== 18) return;
                }

                return msg.guild?.roles.cache?.get(role);
            }

            if (command) {
                if (!msg.guild?.members.me?.permissions?.has(["ViewChannel", "SendMessages", "EmbedLinks", "UseExternalEmojis"])) return msg.reply(bot.replyMessage("Requiero de tener los siguientes permisos para que mis comandos puedan funcionar: `Ver canales`, `Enviar canales`, `Adjuntar links`, `Usar emojis externos`", { emoji: "warning" }));
                if (!command.enabled && !bot.isOwner(msg.author)) return msg.reply(bot.replyMessage("Este comando está deshabilitado temporalmente. Intenta más tarde.", { emoji: "error" }));
                if (command.ownerOnly && !bot.isOwner(msg.author)) return;
                if (command.memberPerms && !msg.member.permissions?.has(command.memberPerms)) return msg.reply(bot.replyMessage(`No cuentas con los permisos requeridos para usar este comando.\n> Permisos requeridos: ${command.memberPerms.map(permission => `\`${bot.utils.guild.roles.permissions[permission]}\``).join(", ")}`, { emoji: "error" }));
                if (command.botPerms && !msg.guild?.members.me?.permissions?.has(command.botPerms)) return msg.reply(bot.replyMessage(`No cuento con los permisos requeridos para efectuar este comando. Por favor añádeme un rol que tenga los siguientes permisos.\n> Permisos requeridos: ${command.botPerms.map(permission => `\`${bot.utils.guild.roles.permissions[permission]}\``).join(", ")}`, { emoji: "error" }));
                if (!bot.isOwner(msg.author)) return msg.reply(bot.replyMessage("Los comandos no están disponibles en este momento.", { emoji: "error" }));

                try {
                    command.run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole);
                } catch (error) {
                    console.error(error);
                }
            } else return;
        } catch (err) {
            bot.error("Hubo un error en el evento.", { name: "messageCreate", type: Type.Event, error: err });
        }
    }
});
