import { Collection, GuildMember, Message, User, WebhookClient } from "discord.js";
import { CommandBuilder } from "../structures/CommandBuilder.js";
import { ContextMenuBuilder } from "../structures/ContextMenuBuilder.js";
import validations from "../utils/validations.json";
import { Logger } from "../structures/Logger.js";

export interface IEmojiListStructure {
  check: string | Array<string>;
  error: string | Array<string>;
  noargs: string | Array<string>;
  sad: string | Array<string>;
  tada: string | Array<string>;
  wait: string | Array<string>;
  warning: string | Array<string>;
  love: string | Array<string>;
}

export interface IReplyMessageDataOptions {
  mention: string;
  emoji: string;
}

export interface IMoonlightClassContent {
  commands: Collection<string, CommandBuilder>;
  slash: Collection<string, ContextMenuBuilder>;
  categories: Collection<string, { name: string; commands: Array<string>; }>;
  aliases: Collection<string, string>;
  hook: WebhookClient;
  utils: typeof validations;
  logger: Logger;
  blacklist_url_list: Array<string>;
  nsfw_url_list: Array<string>;
  begin(): void;
  getPrefix(databaseKey: string): Promise<string>;
  getEmoji(emojiName: string) : string | Array<string> | undefined;
  replyMessage(message: string, data: IReplyMessageDataOptions): string;
  rps(player1: string, player2: string): string;
  shipPercent(result: number): string;
  isOwnerCommand(commandName: string): boolean;
  isOwner(user: GuildMember | User): boolean;
  sendErrorMessage(fn: any): Promise<Message<true>> | undefined;
}
