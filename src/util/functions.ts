import { Message, Routes } from "discord.js";
import { MoonlightClient } from "../structures/Client.js";

export async function getUser(user: string, client: MoonlightClient) {
  if (!user) return;

  if (user.startsWith("\\")) user = user.slice(1);
  if (user.startsWith("<@") && user.endsWith(">")) user = user.slice(2, -1);
  if (!Number(user) && user.length !== 18) return;

  return await client.users.fetch(user);
}

export function getMember(member: string, message: Message) {
  if (!member || !message.inGuild()) return;

  if (member.startsWith("\\")) member = member.slice(1);
  if (member.startsWith("<@") && member.endsWith(">"))
    member = member.slice(2, -1);
  if (!Number(member) && member.length !== 18) return;

  return message.guild.members.cache.get(member);
}

export function getChannel(channel: string, message: Message) {
  if (!channel || !message.inGuild()) return;

  if (channel.startsWith("\\")) channel = channel.slice(1);
  if (channel.startsWith("<#") && channel.endsWith(">"))
    channel = channel.slice(2, -1);
  if (!Number(channel) && channel.length !== 18) return;

  return message.guild.channels.cache.get(channel);
}

export function getRole(role: string, message: Message) {
  if (!role || !message.inGuild()) return;

  if (role.startsWith("\\")) role = role.slice(1);
  if (role.startsWith("<@&") && role.endsWith(">")) role = role.slice(3, -1);
  if (!Number(role) && role.length !== 18) return;

  return message.guild.roles.cache.get(role);
}

export async function fetchAnimeGIF(type: string) {
  return (await fetch(`https://api.otakugifs.xyz/gif?reaction=${type}`).then(
    res => res.json()
  )) as { url: string };
}
