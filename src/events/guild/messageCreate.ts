import { GuildBasedChannel, GuildMember, Message, Role, User } from "discord.js";
import Type from "../../Moonlight";
import { CommandBuilder } from "../../structures/CommandBuilder";
import { EventBuilder } from "../../structures/EventBuilder";

export default new EventBuilder({
    name: "messageCreate",
    async run(bot, msg: Message) {
        try {
            const prefix: string = "!!";
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
                if (command.ownerOnly && !bot.isOwner(msg.author)) return;
                if (!bot.isOwner(msg.author)) return msg.channel.send("Los comandos no están disponibles en este momento.");

                try {
                    command.run(bot, msg, args, prefix, getUser, getMember, getChannel, getRole);
                } catch (error) {
                    console.error(error);
                }
            } else return;
        } catch (err) {
            bot.error("Hubo un error en el evento.", { name: this.name, type: Type.Event, error: err });
        }
    }
});